'use client'
import { useEffect, useRef, useState } from 'react';
import SearchBar from './components/searchBar';
import Chart from "./components/Chart"
import musicLogo from "./components/musicLogo.png"



async function compareWord(text:string): Promise<any> {
  let retData = ""
  return new Promise((resolve, reject) => {
    fetch(`http://localhost:8080/compare/${text}`)
        .then(res => res.json())
        .then(data => {
            resolve(data); // Resolve the Promise with the data
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            reject(error); // Reject the Promise if there's an error
        });
    });

}

async function getRecommendations(comparison:any, limit:number, genres:string[], query:string):Promise<any>{  
  return new Promise((resolve, reject) => {
  // emotion_scores:    angry, happy, sadness, relaxed
  //  anger   = energy++    valence--     
  //  disgust = energy++    valence--     <-- anger
  //  fear    = energy      valence--     <-- sadness
  //  joy     = energy++    valence++     
  //  sadness = energy--    valence--     <-- 
  //  suprise = energy++    valence       <-- relaxation
  const anger = comparison.emotion_scores.anger;
  const disgust = comparison.emotion_scores.disgust;
  const fear = comparison.emotion_scores.fear;
  const joy = comparison.emotion_scores.joy;
  const sadness = comparison.emotion_scores.sadness;
  const suprise = comparison.emotion_scores.suprise;


  let energy = 0.5; let valence = 0.5;
  
  if(anger < 0){ energy -= 0.1; valence += 0.1; }
  if(anger > 0){ energy += 0.1; valence -= 0.1; }

  if(disgust < 0){ energy -= 0.1; valence += 0.1; }
  if(disgust > 0){ energy += 0.1; valence -= 0.1; }

  if(fear < 0){ valence -= 0.1; }
  if(fear > 0){ valence -= 0.1; }

  if(joy < 0){ energy -= 0.1; valence -= 0.1; }
  if(joy > 0){ energy += 0.1; valence += 0.1; }

  if(sadness < 0){ energy += 0.1; valence += 0.1; }
  if(sadness > 0){ energy -= 0.1; valence -= 0.1; }

  if(suprise < 0){ energy -= 0.1;}
  if(suprise > 0){ energy += 0.1;}
  
  //console.log("energy: "+energy)
  //console.log("valence: "+valence)

  resolve (getEmotionsSongs(energy, valence, limit, genres))

  });

}

async function getEmotionsSongs(energy:number, valence:number, limit:number, genres:string[]) : Promise<any[]> {
  return new Promise((resolve, reject) => {
    
  const genresLink = genres.length>1? genres.join("%2C+") : genres[0]
  

  fetch(`http://localhost:8080/getRecs/${genresLink}/${energy}/${valence}`).then(
    res => res.json()
  ).then(
    data=>{
      resolve(data);
    }
  )
  
});
}




export default function Home() {
  


  const showBlockRef = useRef(null);
  const [spotData, setSpot] = useState<any | null>()
  const [comparisonData, setComparison] = useState<any | null>()
  const [recArtist, setRec] = useState<any | null>()
  const [comparisonResult, setComparisonResult] = useState<any | null>()
  const [sentRec, setSentRec] = useState<boolean>(false)
  const [categories, setCategories] = useState<any | null>() 
  const [chosenCat, setChosenCat] = useState<any[]>([]) 
  const [recs, setRecs] = useState<any | null>() 
  const [query, setQuery] = useState('');
  const [ans, setAnswer] = useState<any | null>()

  const removeGenre = (itemToRemove: any) => {
    setChosenCat((prevChosenCat) => prevChosenCat.filter(item => item !== itemToRemove));
  };

  // Example function to handle the click event for removing an item
  const handleRemove = (item: any) => {
      removeGenre(item);
  };



  useEffect(() => {
    fetch(`http://localhost:8080/get_genres`).then(
      res => res.json()
    ).then(
      data=>{
        setCategories(data)
      }
    )

  }, []);

  useEffect(() => {
    
    
    setComparison(
      {"tracks":[
        {"name":"hello", "artists":[{"name":"me"}], "images":[{"url":"https://i.scdn.co/image/ab67616d0000b27307f0c53ea451788a5030e3e3"}]}, 
        {"name":"hello", "artists":[{"name":"me"}], "images":[{"url":"https://i.scdn.co/image/ab67616d0000b27307f0c53ea451788a5030e3e3"}]}, 
        {"name":"hello", "artists":[{"name":"me"}], "images":[{"url":"https://i.scdn.co/image/ab67616d0000b27307f0c53ea451788a5030e3e3"}]}, 
        {"name":"hello", "artists":[{"name":"me"}], "images":[{"url":"https://i.scdn.co/image/ab67616d0000b27307f0c53ea451788a5030e3e3"}]}
      ]}
    )

  }, []);


  useEffect(() => {
    if (recArtist) {
      const result = spotComparison(recArtist, recArtist.genres);
      setComparisonResult(result);
    }
  }, [recArtist]);


  

  


  function artistSearch(name: string): any[] {
    fetch(`http://localhost:8080/search_artist/${name}`).then(
      res => res.json()
    ).then(
      data=>{
        setSpot(data)
      }
    )
    setSentRec(false)
    return []
  }


  function compareWord2(text: string): any {
    let retData = ""
    fetch(`http://localhost:8080/compare/${text}`).then(
      res => res.json()
    ).then(
      data=>{
        retData = data
        console.log("data: ")
        console.log(data)
        setAnswer(data)
        return data
      }
    )
    setSentRec(false)
    //return retData
  }
  


  function spotComparison(object:any, genres: string[]): string {
    setRec(object)
    setSentRec(false)
    return (Math.random()*100).toFixed(2)
  }




 

  return (
      <div>
        {/*<div
            className='w-full z-0 pb-5' id="artistView"
            style={{
              backgroundColor:'var(--projectIsland)',
              height:"fit-content"
            }}>
              <div className="text-7xl z-20 text-[var(--text)] font-bold flex justify-center items-center w-full"
                  style={{
                    //backgroundColor:'var(--bg)',
                    borderRadius:"40%"
                  }}>
                <p className = "mt-5">Recommend Artists!</p>
              </div>
              <div className='flex justify-center items-center w-full'>
                <div className='text-center flex m-5 p-5 text-3xl p-5 float-left text-[var(--text)] w-5/6'>
                  My music taste is hearing a friend's playlist and stealing it. Now, my friends unionized and started charging me for my thievery. 
                  I desperately need my own music taste. Recommend here (please):
                </div>
              </div>
              <div className='w-full flex justify-center items-center'>
                <div className='text-[var(--lightText)] p-5 w-3/4 h-auto bg-[var(--experienceIsland)]'>
                  <SearchBar placeholder="Search for an artist..."
                  searchType="Search Artist"
                  onSearch={function (query: string): void {
                    artistSearch(query)
                  } }>
                  </SearchBar>
                  
                  <div className='w-full flex flex-row flex-wrap text-[var(--text)] relative justify-center items-center'>
                  {spotData && spotData.map((object: any) => (
                      <div className='w-1/6 flex m-2 relative'
                           style={{minWidth:150}}
                           >
                        <div className='w-full bg-[var(--projectIsland)] h-fit-content p-2'>
                          {object.images[0]? 
                            <img src={object.images[0]?.url} className = ""></img>
                            :
                            <img src="https://cdn4.iconfinder.com/data/icons/public-sign-part03/100/_-14-512.png" className = ""></img>
                          }
                          
                          <div className="w-full flex justify-center items-center pt-2" >
                            <div>{object.name}</div>
                          </div>
                          <div className="w-full flex justify-center items-center" >
                            <button className="p-1 m-2 bg-[var(--projectIsland)] hover:bg-[var(--experienceIsland)] text-[var(--text)] hover:text-[var(--lightText)]" 
                            onClick={() => 
                              setComparison(spotComparison(object, object.genres))
                            }
                                style={{
                                    borderRadius:5,
                                    borderWidth:1,
                                    borderColor:"var(--experienceIsland)"
                                }}
                            >Recommend</button>
                          </div>
                        </div>
                      </div>
                  ))}
                  </div>
                  
                  <div className='w-full flex justify-center items-center text-[var(--text)]'>
                    <div className='spotContainer w-[90%] bg-[var(--projectIsland)] flex justify-center items-center p-5'>
                      <div className='w-[50%] spot px-[5%]'
                           style={{
                            maxWidth:"50%",
                            width:"50%",
                            minWidth:200,
                            margin:"5%"
                           }}
                      >
                        <Chart 
                          data={[comparisonResult? comparisonResult:0, comparisonResult? 100-comparisonResult:0]}
                          />
                      </div>
                      <div className='w-[50%] spot'
                           style={{
                            maxWidth:"50%",
                            width:"50%",
                            minWidth:200
                           }}>
                        <div className='w-full text-2xl flex justify-center items-center bg-[var(--projectIsland)]'>
                          Similarity:
                        </div>
                        <div className='w-full text-7xl flex justify-center items-center bg-[var(--projectIsland)]'>
                          {recArtist? comparisonResult+"%" : "..."}
                        </div>
                        
                        <div className='w-full text-lg text-center flex justify-center items-center bg-[var(--projectIsland)] pt-5'>
                          <div className='w-3/4'>
                          {comparisonResult<25?
                            "Woah, I'm always open to new tastes!" : 
                          comparisonResult>=25 && comparisonResult<50?
                            "Interesting, this could become something I like..." :
                          comparisonResult>=50 && comparisonResult<75?
                            "This sounds like something I'd like!" :
                          comparisonResult>=75 && comparisonResult<100?
                            "Do we have the same music taste?" : null
                          }
                            
                            
                          </div>
                        </div>
                        <div className='w-full text-sm flex justify-center items-center bg-[var(--projectIsland)] pt-5'>
                          <div className='w-1/2'>Currently, this value is randomized as I wait for Spotify to approve some data I wanted :)</div>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  {!sentRec? 
                  <div className="text-3xl m-5 w-full flex justify-center items-center" >
                    <button className="px-5 p-3 m-2 bg-[var(--experienceIsland)] hover:bg-[var(--projectIsland)] text-[var(--lightText)] hover:text-[var(--text)]" 
                    onClick={() => setSentRec(true)}
                        style={{
                            borderRadius:5,
                            borderWidth:1,
                            borderColor:"var(--projectIsland)"
                        }}
                    >Send Recommendation</button>
                  </div>
                  :null}
                  {sentRec? 
                  <div className="text-4xl m-5 w-full flex justify-center items-center" >
                    <div className="px-5 p-3 m-2" 
                    //onClick={() => }
                    >Sent!</div>
                  </div>
                  : null}
                </div>
              </div>
              

        </div>*/}

        

        <div
            className='w-full z-0 pb-5' id="artistView"
            style={{
              backgroundColor:'var(--projectIsland)',
              height:"fit-content"
            }}> 
            <div className="w-full text-center text-[var(--text)] text-5xl pt-10">Choose Genres!</div>
              <div className='w-full flex justify-center items-center'>
                <div className='text-[var(--lightText)] p-5 w-3/4 h-auto bg-[var(--projectIsland)]'>
                  
                  <div className='w-full flex flex-row flex-wrap text-[var(--text)] relative justify-center items-center'>
                  {spotData && spotData.map((object: any) => (
                      <div className='w-1/6 flex m-2 relative'
                           style={{minWidth:150}}
                           >
                        
                      </div>
                  ))}
                  </div>
                  <div className="flex flex-wrap justify-center items-center text-lg" >
                    {categories && categories.genres.map((object: any) => (
                      <div className='w-fit-content h-fit-content m-2 hover:m-1' >
                        
                      <button className = "w-auto h-fit-content bg-[var(--experienceIsland)] text-[var(--lightText)] p-1 px-2 hover:px-3 hover:p-2"
                           style={{
                            borderRadius:5,
                            borderWidth:2,
                            backgroundColor: chosenCat.includes(object)? "var(--experienceIsland)" : "var(--projectIsland)",
                            color: chosenCat.includes(object)? "var(--projectIsland)" : "var(--experienceIsland)",
                            borderColor:"var(--experienceIsland)"
                           }}
                           onClick={()=>{
                            if(!chosenCat.includes(object)){
                              if(Array.isArray(chosenCat) && chosenCat.length!=0 ){
                                setChosenCat([object, ...chosenCat])
                              }else{
                                setChosenCat([object])
                              }
                            }else{
                              handleRemove(object)
                            }
                           }}
                      >
                        {object}
                      </button>
                      </div>
                          ))}
                  </div>

                </div>
              </div>
            <div className="w-full text-center text-[var(--text)] text-5xl p-10">Enter your writing :)</div>
            
            <div className='w-full flex justify-center items-center'>
            <div
              className='w-3/4 z-0 bg-[var(--experienceIsland)] p-2 justify-center items-center' id=""
              style={{
                backgroundColor:'var(--experienceIsland)',
                height:"fit-content"
              }}>
              <SearchBar placeholder="Insert your work..."
                searchType={chosenCat.length!=0? "Generate Playlist":"Choose Genres First"}
                onSearch={async function (query: string): Promise<void> {
                  const ans = await compareWord(query)
                  //console.log(compareWord(query))
                  const recs = await getRecommendations(ans, 10, chosenCat, query)
                  setRecs(recs)

                }} 
                isDisabled = {chosenCat.length==0}
                >
              </SearchBar>
              <div className="w-full flex items-center justify-center">
              <div className="" style={{
                width:"fit-content",
                minHeight:600
              }}>
              {recs?.tracks?.map((object: any) => (
                <a href={object.external_urls.spotify} target="_blank">
                <div className=' p-2 w-[45%] h-fit flex float-left m-[1%]' style={{
                  borderWidth:2,
                  borderColor:"var(--lightText)",
                  borderRadius:10,
                }}>
                  <div className='w-150 float-left'>
                    <img src={object.album?.images? object.album.images[0].url : musicLogo.src} style={{
                      height:150
                    }}></img>
                  </div>
                  <div className='w-[45%] float-left'>
                    <div className='text-white text-xl w-fit h-fit float-left mx-3'>
                      {object.name}
                      
                    </div>
                    <div className='text-white text-lg w-fit h-fit mx-3'>
                      {object.artists[0].name}
                    </div>
                  </div>
                </div>
                </a>

              ))}</div></div>

            </div>
            </div>
              

        </div>



        
        
      </div>

  );
}

//api key: KNvkxEDA6ycCPQ7STMrcG296I3G4Wrku9NRTbzb5