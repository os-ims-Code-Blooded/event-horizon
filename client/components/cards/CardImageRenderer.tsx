import React from "react";

// Damage card icons//
import { GiRocketThruster } from "react-icons/gi"; // high damage card
import { GiMineExplosion } from "react-icons/gi";  // moderate damage card
import { GiIncomingRocket } from "react-icons/gi"; // low damage card

// Armor card icons //
import { GiArmorUpgrade } from "react-icons/gi"; // low-moderate armor upgrade
import { GiLayeredArmor } from "react-icons/gi"; // high armor card

// Duration icon //
import { PiClockClockwiseFill } from "react-icons/pi";

export default function renderCardImage(card: any){

  // if the card does damage we want to return damage images
  if (card.damage) {

    if (card.damage <= 20) {
      return <GiIncomingRocket style={{height: 'inherit', width: 'inherit', maxHeight: '50%', maxWidth: '50%', transform: 'rotate(270deg)'}}/>
    } else if (card.damage <= 30) {
      return <GiMineExplosion style={{height: 'inherit', width: 'inherit', maxHeight: '50%', maxWidth: '50%'}}/>
    } else if (card.damage > 30) {
      return <GiRocketThruster style={{height: 'inherit', width: 'inherit', maxHeight: '50%', maxWidth: '50%'}}/>
    }

  // if the card grants armor bonuses we want to show armor bonuses
  } else {
    
    if (card.armor <= 10) {
      return <GiArmorUpgrade style={{height: 'inherit', width: 'inherit', maxHeight: '50%', maxWidth: '50%'}}/>
    } else {
      return <GiLayeredArmor style={{height: 'inherit', width: 'inherit', maxHeight: '50%', maxWidth: '50%'}}/>
    }

  }

}