'use client'
import { useEffect, useRef, useState } from 'react';
import SearchBar from './components/searchBar';
import Chart from "./components/Chart"





export default function Home() {

  const showBlockRef = useRef(null);
  const [spotData, setSpot] = useState<any | null>()
  const [comparisonData, setComparison] = useState<any | null>()
  const [recArtist, setRec] = useState<any | null>()
  const [comparisonResult, setComparisonResult] = useState<any | null>()
  const [sentRec, setSentRec] = useState<boolean>(false)

  useEffect(() => {
    if (recArtist) {
      const result = spotComparison(recArtist, recArtist.genres);
      setComparisonResult(result);
    }
  }, [recArtist]);


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
        console.log(data)
      }
    )
    setSentRec(false)
    return []
  }

  function spotComparison(object:any, genres: string[]): string {
    setRec(object)
    setSentRec(false)
    return (Math.random()*100).toFixed(2)
  }




 

  return (
      <div>
        <div
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
                  {/*spotData?
                  <SearchBar 
                  placeholder="Search for a title..."
                  searchType="Search Song"
                  onSearch={function (query: string): void {
                    artistSearch(query)
                  } }>
                </SearchBar> : null*/}
                  
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
              

          </div>
        
      </div>

  );
}

//api key: KNvkxEDA6ycCPQ7STMrcG296I3G4Wrku9NRTbzb5