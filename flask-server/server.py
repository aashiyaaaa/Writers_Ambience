import json
from dotenv import load_dotenv
import os
import base64 
from requests import post, get
from flask import Flask
from flask_cors import CORS
#from amplify import define_auth, secret



app = Flask(__name__)
CORS(app)

load_dotenv()



client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")






def get_token():
    auth_string = client_id+":"+client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url="https://accounts.spotify.com/api/token"
    headers={
        "Authorization":"Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data={"grant_type" : "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    return {"Authorization": "Bearer " + token}


token = get_token()


@app.route('/members')
def members():
    return {"members" : ["Member1", "Member2"]}



@app.route("/search_artist/<artistName>")
def search_artist(artistName):
    url="https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query= f"?q={artistName}&type=artist&limit=5"

    queryUrl = url + query
    result = get(queryUrl, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]
    if len(json_result)==0:
        print("No artist with this name exists :(")
        return None
    return json_result

@app.route("/artist_songs/<artistID>")
def getArtistSongs(artistID):
    url=f"https://api.spotify.com/v1/artists/{artistID}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result


result = search_artist("ACDC")
artistID = result[0]["id"]
songs = getArtistSongs(artistID)
#print(songs)

for idx, song in enumerate(songs):
    print (f"{idx + 1}.{song['name']}")




if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
    