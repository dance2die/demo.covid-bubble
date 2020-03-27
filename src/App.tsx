import React from 'react'
import { ResponsiveBubble } from '@nivo/circle-packing'

// import rootData from './data/root2.json'
import bycountry from './data/bycountry.json'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

type Stat = {
  confirmed: number
  death: number
  recovered: number
}

const getProvinceData = (i: number, province: string, stats: Stat) => ({
  name: province,
  color: `hsl(71, ${i - 5}%, 60%)`,
  children: [
    {
      name: 'confirmed',
      color: 'hsl(197, 70%, 50%)',
      count: stats.confirmed || 0
    },
    {
      name: 'death',
      color: 'hsl(267, 70%, 50%)',
      count: stats.death || 0
    },
    {
      name: 'recovered',
      color: 'hsl(308, 70%, 50%)',
      count: stats.recovered || 0
    }
  ]
})

type ByCountry = (data: any) => any

const byCountry: ByCountry = data =>
  data.reduce((acc: any, { country, province, stats }: any, i: any) => {
    if (acc[country]) {
      if (province) {
        acc[country].children.push(getProvinceData(i, province, stats))
      } else {
        acc[country].children.push(
          {
            name: 'confirmed',
            color: 'hsl(197, 70%, 50%)',
            count: stats.confirmed || 0
          },
          {
            name: 'death',
            color: 'hsl(267, 70%, 50%)',
            count: stats.death || 0
          },
          {
            name: 'recovered',
            color: 'hsl(308, 70%, 50%)',
            count: stats.recovered || 0
          }
        )
      }
    } else {
      const children = []
      if (province) children.push(getProvinceData(i, province, stats))
      else
        children.push(
          {
            name: 'confirmed',
            color: 'hsl(197, 70%, 50%)',
            count: stats.confirmed || 0
          },
          {
            name: 'death',
            color: 'hsl(267, 70%, 50%)',
            count: stats.death || 0
          },
          {
            name: 'recovered',
            color: 'hsl(308, 70%, 50%)',
            count: stats.recovered || 0
          }
        )

      acc[country] = { children }
    }

    // console.info(`acc${i} =>`, JSON.stringify(acc, null, 2))

    return acc
  }, {})

// console.info(`byCountry ==>`, JSON.stringify(byCountry, null, 2))

const normalize = (data: any) => ({
  name: 'covid19',
  color: 'hsl(71, 70%, 50%)',
  children: Object.keys(byCountry).map((name, i) => ({
    name,
    color: `hsl(34, ${i + 1}%, ${i + 10}%)`,
    children: byCountry(data)[name]
  }))
})

const MyResponsiveBubble = ({ root }: any) => (
  <ResponsiveBubble
    root={root}
    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
    identity='name'
    value='count'
    colors={{ scheme: 'nivo' }}
    padding={6}
    labelTextColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
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
    motionStiffness={90}
    motionDamping={12}
    tooltip={({
      id,
      value,
      color
    }: {
      id: number
      value: string
      color: string
    }) => (
      <strong style={{ color }}>
        {id}: {value}
      </strong>
    )}
  />
)

function App() {
  return (
    <div className='flex flex-col h-full items-center justify-center bg-gray-900 text-white'>
      <MyResponsiveBubble root={normalize(bycountry)} />
    </div>
  )
}

export default App
