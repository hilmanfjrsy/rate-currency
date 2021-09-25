import React, { Component, useEffect, useState } from 'react';
import axios from 'axios'
import './App.css'

export default function App() {
  const apiKey = "f614a29c7fb9ada1f5822decbad67232"
  const host = "http://api.exchangeratesapi.io/"
  const symbol = "CAD, IDR, JPY, CHF, USD"
  const [dataRates, setDataRates] = useState([])
  const [shuffle, setShuffle] = useState(false)
  const [count, setCount] = useState(0)
  const [firstLoading, setFirstLoading] = useState(true)
  const [rate, setRate] = useState(null)

  async function getData() {
    try {
      let res = null
      if (firstLoading) {
        res = await axios.get(host + "v1/latest?access_key=" + apiKey + "&symbols=" + symbol + "&format=1")
        // res = {
        //   "data": {
        //     "success": true,
        //     "timestamp": 1632535744,
        //     "base": "EUR",
        //     "date": "2021-09-25",
        //     "rates": {
        //       "USD": 1.17201,
        //       "AUD": 1.613784,
        //       "CAD": 1.483847,
        //       "PLN": 4.605396,
        //       "MXN": 23.504313
        //     },
        //   }
        // }
        // console.log('masuk sini',res.data)
        await setFirstLoading(false)
        await setRate(res.data)
      }
      await processData(res?.data)
    } catch (error) {
      console.log(error)
    }
  }

  function processData(r = rate) {
    // console.log('sini proses',r)
    if (r) {
      let tempData = []
      let rates = r.rates

      for (const key in rates) {
        let randomNumber = Math.floor(Math.random() * 4) + 2;
        let persen = randomNumber / 100 * rates[key]
        let buyRates = rates[key] + persen
        let sellRates = rates[key] - persen

        tempData.push({
          "base": key,
          "exchange_rates": rates[key].toFixed(4),
          "sell_rates": sellRates.toFixed(4),
          "buy_rates": buyRates.toFixed(4),
        })
      }
      // console.log("CEK DATA",tempData)
      setDataRates(tempData)
      setShuffle(false)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      getData()
    }, 2000);
  }, [count])

  if (firstLoading) {
    return (
      <div className='container'>
        <div className="loading"></div>
        <h6>Loading...</h6>
      </div>
    )
  }

  return (
    <div className='container'>
      <table>
        <thead>
          <tr className="head-title">
            <th></th>
            <th>We Buy</th>
            <th>Exchange Rates</th>
            <th>We Sell</th>
          </tr>
        </thead>
        <tbody>
          {dataRates.map((item, index) =>
            <tr key={index}>
              <td>{item.base}</td>
              <td>{item.buy_rates}</td>
              <td>{item.exchange_rates}</td>
              <td>{item.sell_rates}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>*currency rate is {rate?.base}</p>
      <div style={{ flexDirection: 'row', alignItems: 'center' }}>
        <button onClick={() => {
          setShuffle(true);
          setCount((prev) => prev + 1)
        }}>
          {shuffle ?
            <Loading />
            :
            "Random"
          }
        </button>
        <button className='refresh' onClick={() => window.location.reload()}>
          Refresh
        </button>
      </div>
    </div>
  )

  function Loading() {
    return (
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    )
  }
}
