import React, {useState, useEffect, UIEvent, EventHandler} from 'react';
// import axios from 'axios';

import {getData, item} from "./data";

let v = 0
let prevPosition = 0

const dataCount = 20
const maxPageCount = 5

const FetchedData: item[][] = []

const getPageCountFromData = (length: number) => ~~(length / dataCount) + (~~(length / dataCount) * dataCount < length ? 1 : 0)

const itemHeight = 50
let pageCount = -1

function App() {
    console.log(`render Count ${v++}`)
    const [picData, setPicData] = useState<item[]>([]);
    const [pageNo, setPageNo] = useState<number>(0)


    const fetchData = async (event?: UIEvent<HTMLElement>) => {

        if (pageNo === pageCount) return
        if (FetchedData[pageNo + 1]?.length) {
            setPicData((current: item[]) => {
                if (pageNo <= maxPageCount) return ([...current, ...FetchedData[pageNo + 1]])
                return [...current.slice(dataCount, maxPageCount * dataCount + 1), ...FetchedData[pageNo + 1]];
            });
            setPageNo(prev => ++prev)
            return
        }

        try {

            const res: any = await getData(pageNo)
            // console.log(res)

            setPicData((current: item[]) => {
                if (pageNo < maxPageCount) {
                    return ([...current, ...res.results.map((item: item, index: number) => ({
                        ...item,
                        index: pageNo * dataCount + index
                    }))])
                }
                // @ts-ignore
                if (event) event.target.scrollTop -= dataCount * itemHeight / 2
                return [...current.slice(dataCount, maxPageCount * dataCount), ...res.results.map((item: item, index: number) => ({
                    ...item,
                    index: pageNo * dataCount + index
                }))];
            });
            setPageNo(prev => ++prev)
            FetchedData.push(res.results.map((item: item, index: number) => ({
                ...item,
                index: pageNo * dataCount + index
            })))
            const resPageCount = getPageCountFromData(~~res.count)
            if (pageCount !== resPageCount) pageCount = resPageCount
        } catch (err) {
        }
    };

    useEffect(() => {
        fetchData().then(r => r);
    }, []);


    const handleScroll: EventHandler<UIEvent<HTMLElement>> = (event: UIEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        const currentScrollY = target.scrollTop;

        if (Math.abs(prevPosition - currentScrollY) < 50) return
        if (prevPosition < currentScrollY && target.scrollTop > (target.scrollHeight - target.offsetHeight) - 100) fetchData(event).then(r => r)

        if (prevPosition > currentScrollY && target.scrollTop < 100) getPrevData(event)

        prevPosition = currentScrollY

    }


    const getPrevData = (event: UIEvent<HTMLElement>) => {
        if (pageNo < maxPageCount) return
        setPicData(current => ([...FetchedData[pageNo - maxPageCount], ...current.slice(0, (maxPageCount - 1) * dataCount)]))
        // @ts-ignore
        event.target.scrollTop += dataCount * itemHeight / 2
        setPageNo(prev => --prev)
    }

    console.log({FetchedData, pageCount, pageNo, dataCount: picData.length})


    return (
        <div onScroll={handleScroll} style={{
            height: "60vh",
            backgroundColor: "#4444",
            overflow: "hidden auto",
            margin: "20vh 10vw",
            width: "80vw"
        }}>
            <table className='table'>
                <thead>
                <tr>
                    <th scope='col'>Title</th>
                    <th scope='col'>Photo</th>
                </tr>
                </thead>
                <tbody>
                {picData.map(item => {
                    return (
                        <tr>
                            <td>{item.index || 0}</td>
                            <td>{item.application_number}</td>
                            <td><img style={{height: itemHeight, width: 200}} src={item.logo} alt=''/></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>

        </div>
    );
}

export const MemorizedApp = React.memo(App);


// for (let index = 0; index < res.results.length; index += 5) {
//   let myChunk = res?.results.slice(index, index + 5);
//   tempArray.push(myChunk);
//   setChunkedArray(tempArray)
// }


