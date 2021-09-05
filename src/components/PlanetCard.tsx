import React from 'react'
import { PlanetData } from '../services/contractInteraction'
function PlanetCard(props: PlanetData): React.ReactElement {
  return (
    <a
      href={`https://opensea.io/assets/0x15e32bac6c5f89c66631f3a8391bc49eacc03985/${props.tokenId}`}
      target="_blank"
      rel="noreferrer noopener"
      className="planet-container">
      <img width="250px" src={props.image} alt="planet" />
      {/* In the image there is all info you needed is rendered*/}
      {/* <div className="attributes">
        <ul>
          {props.tokenURIData.attributes.map((attr) => (
            <li key={`${props.tokenId}-attr-${attr.trait_type}`}>{attr.value}</li>
          ))}
        </ul>
      </div> */}
    </a>
  )
}
export default PlanetCard
