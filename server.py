from flask import Flask, render_template
import numpy as np
import math

app = Flask(__name__)

def getUser(user,variation):
	
	import urllib2	
	import json
	
	url_lichess = 'https://en.lichess.org/@/'+user+'/perf/'+variation
	error = False
	result = {}

	try:
		request = urllib2.Request( url_lichess , headers = {"Accept" : "application/vnd.lichess.v2+json" })
		result = json.load(urllib2.urlopen(request))
	
	except:
		error = True 

	return result , error

def DensityFunction(lbda,x):
	return math.exp(-lbda * x)

def clearenceEquation(actElo,maxElo,minElo,time):
	return -(math.log(float(actElo - maxElo) /-(maxElo - minElo)) / (time))

def Distribution(collection,variation,indicator,gwrh):
	
	AVG = collection.aggregate([{ "$match": {  variation+"."+indicator+"" : { "$exists": "true", "$ne": "null" }} },   { "$project" : { "avg": { "$avg": "$"+variation+"."+indicator+"" }}} ])
	samples = []
	
	for x in AVG:
		samples.append(round(x['avg'],10))

	return samples , round(1 - DensityFunction(1/np.mean(samples) , gwrh),2) 

def computeMaths(args):
	
	from datetime import datetime
	import pymongo

	maxElo = 3000	

	games = args['count']['all']                  # GET NUMBERS OF GAMES 
	hours = args['count']['seconds'] / 3600.0     # GET NUMBERS HOURS 

	actElo = int(args['perf']['rating'])          # GET ACTUAL ELO
	minElo = args['lowest']['int']				  # GET MIN ELO
	
	# MODEL APLY         [  dL/dt  = K(Lmax - L)  solved mode is equal  L(t) = Lmax - ( Lmax -  M) * exp^(-k*t) ] http://www.math24.net/learning-curve.html

	GwRG =  clearenceEquation(actElo,maxElo,minElo,games) # Growth Rate by games
	GwRH =  clearenceEquation(actElo,maxElo,minElo,hours)  # Growth Rate by hours 

	R = { 'at':datetime.utcnow(),'elo':actElo,'games':games,'hours':hours,'gwrg':GwRG,'gwrh':GwRH} # BUILD LOG 
 
	MONGODB_URI = '' 
	client = pymongo.MongoClient(MONGODB_URI)
	db = client.get_default_database()

	profile = db['profile']

	collection = profile.find_one({'username':args['user']['name']})

	if collection != None:
		if args['variation'] in collection.keys():
			indicators = collection[args['variation']]
			max_hour = max(indicators, key=lambda x:x['hours'])
			
			if round(max_hour['hours'],2) != round(hours,2):
				profile.update({'_id':collection['_id']}, { "$push": {args['variation']:R}})
			
			R['gwrgavg'] = np.mean([x['gwrg'] for x in indicators])
			R['gwrhavg'] = np.mean([x['gwrh'] for x in indicators])

		else:
			collection[args['variation']] = [R]
			profile.update({'_id':collection['_id']},collection,False)
			R['gwrgavg'] = GwRG
			R['gwrhavg'] = GwRH

	else:
		document = {'username':args['user']['name'],args['variation']:R}
		profile.insert(document)
		R['gwrgavg'] = GwRG
		R['gwrhavg'] = GwRH


	R['min'] = minElo  # ADD MIN ELO FOR COMPUTE EQUATION ON FRONTED

	R['distributionhours'],R['densityfunctionhours']  = Distribution(profile,args['variation'],'gwrh',R['gwrhavg'])
	
	return R

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/<user>/<variation>')
def compute(user = None , variation = None):
	data , error = getUser(user,variation)
	if error:
		return render_template('home.html', error = 'USER NOT FOUND')

	if bool(data['perf']['glicko']['provisional']):
		return render_template('home.html', error = 'YOU HAVE A PROVISIONAL ELO')	
	try:
		
		args = {
				'user': data['user'] ,
				'variation': data['stat']['perfType']['key'],
				'perf':data['perf']['glicko'] ,
				'lowest' : data['stat']['lowest'] , 
				'highest':data['stat']['highest'] , 
				'count' : data['stat']['count'] 
				}
		
		computeMathsD = computeMaths(args)

		return render_template('result.html',computeMaths = computeMathsD , username = args['user'] , variation = args['variation'])
	except:
		return render_template('home.html', error = 'WITHOUT ENOUGH DATA')


if __name__ == '__main__':
    app.run(debug=True)

