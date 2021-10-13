import React, {useState, useEffect} from 'react';
// import axios from 'axios';

import {getData, item} from "./data"

const tableData = []


function App() {
    const [picData, setPicData] = useState<any>();
    const [pageNo, setPageNo] = useState<number>(1);
    const [chunkedArray, setChunkedArray] = useState<any[]>([]);
    // eslint-disable-next-line
    const [moreData, setMoreData] = useState<number>(10);
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(false);


    console.log('chunked', chunkedArray);


    useEffect(() => {
        const fetchData = async () => {
            let tempArray = []
            try {
                setIsLoading(true);
                const res: any = await getData(pageNo)
                setPicData((current:any) => ([...current, ...res]));

                tableData.push(res)
                setPageNo(prev => ++prev)

                // for (let index = 0; index < res.results.length; index += 5) {
                //   let myChunk = res?.results.slice(index, index + 5);
                //   tempArray.push(myChunk);
                //   setChunkedArray(tempArray)
                // }

            } catch (err) {
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);


    const loadMore = () => {
        // setMoreData((moreCat) => moreCat + 10);
    };


    return (
        <div onScroll={e => console.log(e)} style={{height: "100vh", overflow: "hidden auto"}} className='ImageAPI'>
            <table className='table'>
                <thead>
                <tr>
                    <th scope='col'>Title</th>
                    <th scope='col'>Photo</th>
                </tr>
                </thead>
                <tbody>
                {picData?.results.map((item: any) => {
                    return (
                        <tr key={item.id}>
                            <td>{item.application_number}</td>
                            <td><img style={{height: 200, width: 200}} src={item.logo} alt=''/></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>

        </div>
    );
}

export default App;
