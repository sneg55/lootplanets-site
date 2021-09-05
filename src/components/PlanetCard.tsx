import React from 'react'
import { PlanetData } from '../services/contractInteraction'
function PlanetCard(props: PlanetData): React.ReactElement {
  return (
    <div className="planet-container">
      <img width="250px" src={props.image} alt="planet" />
      {/* In the image there is all info you needed is rendered*/}
      {/* <div className="attributes">
        <ul>
          {props.tokenURIData.attributes.map((attr) => (
            <li key={`${props.tokenId}-attr-${attr.trait_type}`}>{attr.value}</li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}
export default PlanetCard
