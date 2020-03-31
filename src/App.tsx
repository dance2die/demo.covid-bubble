import React from 'react'
import { ResponsiveBubble as Bubble } from '@nivo/circle-packing'
// import { Bubble } from '@nivo/circle-packing'
// import { ResponsiveBubbleHtml  as Bubble } from '@nivo/circle-packing'
// import { ResponsiveBubbleCanvas   as Bubble } from '@nivo/circle-packing'

// import rootData from './data/root2.json'
import bycountry from './data/bycountry.json'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

type Stats = {
  confirmed: number
  deaths: number
  recovered: number
}

type ByCountry = (data: any) => any

const getStatsChildren = (stats: Stats) => {
  const result = []

  if (stats.confirmed && stats.confirmed > 0)
    result.push({
      name: 'confirmed',
      color: 'hsl(77, 88%, 49%)',
      count: stats.confirmed
    })

  if (stats.deaths && stats.deaths > 0)
    result.push({
      name: 'deaths',
      color: 'hsl(17, 88%, 49%)',
      count: stats.deaths
    })

  if (stats.recovered && stats.recovered > 0)
    result.push({
      name: 'recovered',
      color: 'hsl(107, 88%, 49%)',
      count: stats.recovered
    })

  return result
}

const getProvinceData = (i: number, province: string, stats: Stats) => ({
  name: province,
  // color: `hsl(71, ${i - 5}%, 60%)`,
  color: `hsl(53, 88%, 49%)`,
  children: getStatsChildren(stats)
})

const byCountry: ByCountry = data =>
  data.reduce((acc: any, { country, province, stats }: any, i: any) => {
    // if (country !== "US") return acc;

    if (acc[country]) {
      if (province) {
        acc[country].children.push(getProvinceData(i, province, stats))
        // acc[country].children = getProvinceData(i, province, stats)
      } else {
        acc[country].children = getStatsChildren(stats)
      }
    } else {
      let children = []
      if (province) children.push(getProvinceData(i, province, stats))
      else children = getStatsChildren(stats)

      acc[country] = { children }
    }

    return acc
  }, {})

const normalize = (data: any) => {
  // console.info(`byCountry ==>`, JSON.stringify(byCountry(data), null, 2))
  // console.info(`byCountry ==>`, byCountry(data))

  return {
    name: 'covid19',
    color: 'hsl(197, 88%, 49%)',
    children: Object.keys(byCountry(data)).map((name, i) => ({
      name,
      color: 'hsl(197, 88%, 49%)',
      // color: `hsl(34, ${i + 1}%, ${i + 10}%)`,
      children: byCountry(data)[name].children
    }))
  }
}

const MyResponsiveBubble = ({ root }: any) => (
  <Bubble
    // width={800}
    // height={800}
    root={root}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    identity='name'
    value='count'
    // colors={{ scheme: 'nivo' }}
    colors={{ scheme: 'purple_blue_green' }}
    // colorBy='name'
    colorBy='depth'
    padding={6}
    // labelTextColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
    labelTextColor="black"
    borderWidth={2}
    borderColor={{ from: 'color' }}
    defs={[
      {
        id: 'lines',
        type: 'patternLines',
        background: 'none',
        color: 'inherit',
        rotation: -45,
        lineWidth: 5,
        spacing: 8
      }
    ]}
    fill={[{ match: { depth: 1 }, id: 'lines' }]}
    animate={true}
    motionStiffness={66}
    motionDamping={12}
    tooltip={({
      id,
      value,
      color,
      depth,
      path,
      parent,
      ...rest
    }: {
      id: number
      value: string
      color: string
      depth: number
      path: string
      parent: any
      rest: any
    }) => {
      // console.info(`rest`, rest, id, value, color)
      // console.info(`parent, depth, path`, parent, depth, path, id, value, color)

      return (
        <strong style={{ color }}>
          {/* {id}: {value} */}
          {depth > 0
            ? path
                .split('.')
                .reverse()
                .slice(1)
                .join('/')
            : id}
          : {value}
        </strong>
      )
    }}
  />
)

function App() {
  const data = normalize(bycountry)

  // console.log(`data =>>`, data)

  // return <h1>hi</h1>

  return (
    <div className='flex flex-col h-full items-center justify-center bg-gray-900 text-white'>
      <MyResponsiveBubble root={data} />
    </div>
  )
}

export default App
