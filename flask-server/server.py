import json
from dotenv import load_dotenv
import os
import base64 
from requests import post, get
from flask import Flask
from flask_cors import CORS
import http.client
import requests






app = Flask(__name__)
CORS(app)

load_dotenv()

client_id=os.getenv("CLIENT_ID")
client_secret=os.getenv("CLIENT_SECRET")
rapidAPI = os.getenv("RAPID_API")







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

def get_search_params(genre, type):
    search_params = {
        'q':f'genre:{genre}',
        'type':f'{type}'
    }
    return search_params


def get_auth_header(token):
    return {"Authorization": "Bearer " + token}


token = get_token()


@app.route('/compare/<text>')
def compare(text):
    url = "https://twinword-emotion-analysis-v1.p.rapidapi.com/analyze/"

    querystring = {"text":text}

    headers = {
        "x-rapidapi-key": rapidAPI,
        "x-rapidapi-host": "twinword-emotion-analysis-v1.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    response = requests.get(url, headers=headers, params=querystring)

    #print(response.json())
    return response.json()




@app.route('/members')
def members():
    return {"members" : ["Member1", "Member2"]}



@app.route("/search_artist/<artistName>")
def search_artist(artistName):
    url=f"https://api.spotify.com/v1/search?q={artistName}&type=artist&limit=5"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]

    if len(json_result)==0:
        print("No artist with this name exists :(")
        return None
    return json_result



@app.route("/artist_songs/<artistID>")
def artist_songs(artistID):
    url=f"https://api.spotify.com/v1/artists/{artistID}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]

    return json_result



@app.route("/getRecs/<genresLink>/<energy>/<valence>")
def getRecs(genresLink, energy, valence):
    url=f"https://api.spotify.com/v1/recommendations?limit=10&seed_genres={genresLink}&target_energy={energy}&target_valence={valence}"
        # https://api.spotify.com/v1/recommendations?seed_genres=latino%2C+latin&target_energy=0.5&target_valence=0.5' 
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    try:
        json_result = json.loads(result.content)
    except:
        print('Decoding JSON has failed')


    return json_result



@app.route("/get_genres")
def get_genres():
    url="https://api.spotify.com/v1/recommendations/available-genre-seeds"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)

    return json_result


@app.route("/get_music/<genre>/<track>")
def get_category(genre, track):
    url=f"https://api.spotify.com/v1/search?q={genre}&type={track}&limit=5"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)

    return json_result




#compare("happy")
result = search_artist("ACDC")
artistID = result[0]["id"]
songs = artist_songs(artistID)
#print(compare("I am so happy"))

#for idx, song in enumerate(songs):
    #print (f"{idx + 1}.{song['name']}")




if __name__ == "__main__":
    app.run(debug=True, port=8080)
    

genres = [
    "Action/Adventure fiction",
    "Children’s fiction",
    "Classic fiction",
    "Contemporary fiction",
    "Fantasy",
    "Graphic novel",
    "Historical fiction",
    "Horror",
    "LGBTQ+",
    "Literary fiction",
    "Mystery",
    "New adult",
    "Romance",
    "Satire",
    "Science fiction",
    "Short story",
    "Thriller",
    "Western",
    "Women’s fiction",
    "Young adult",
    "Art & photography",
    "Autobiography/Memoir",
    "Biography",
    "Essays",
    "Food & drink",
    "History",
    "How-To/Guides",
    "Humanities & social sciences",
    "Humor",
    "Parenting",
    "Philosophy",
    "Religion & spirituality",
    "Science & technology",
    "Self-help",
    "Travel",
    "True crime"
]
