/* eslint-disable no-alert */

const { createRef } = require("react");

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  const coffee = document.getElementById('coffee_counter');
    coffee.innerText = coffeeQty;

}

function clickCoffee(data) {
  data.coffee++;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  for (let i = 0; i < producers.length; i++) {
    let currentProducer = producers[i];
    if (coffeeCount >= (currentProducer.price)/2) {
      currentProducer.unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  return data.producers.filter(producer => producer.unlocked === true);
  //returns all unlocked
}

function makeDisplayNameFromId(id) {
  let idArr = id.split('_');
  let newArr = [];
  for (let i = 0; i < idArr.length; i++) {
    let curr = idArr[i];
    newArr.push(curr.charAt(0).toUpperCase() + curr.slice(1));
  }
  return newArr.join(' ');

}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

function renderProducers(data) {
  const producerContainer = document.getElementById('producer_container');
  deleteAllChildNodes(producerContainer);
  unlockProducers(data.producers, data.coffee);
  let unlocked = getUnlockedProducers(data);
  for (let i = 0; i < unlocked.length; i++) {
    let curr = data.producers[i];
      let child = makeProducerDiv(curr);
      producerContainer.appendChild(child);
}}


/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    let curr = data.producers[i];
    if (curr.id === producerId) {
      return curr;
    }
  }
}
function canAffordProducer(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) {
      if (data.coffee >= data.producers[i].price) {
        return true
      }
    }
    return false;
  }
}
function updateCPSView(cps) {
  const rate = document.querySelector('#cps');
  rate.innerText = cps;

}

function updatePrice(oldPrice) {
  return parseInt(1.25* (oldPrice))
}

function attemptToBuyProducer(data, producerId) {
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].id === producerId) {
      if (data.coffee >= data.producers[i].price) {
        data.coffee-=data.producers[i].price;
        data.producers[i].qty++;
        data.producers[i].price = updatePrice(data.producers[i].price);
        data.totalCPS += data.producers[i].cps;
        return true
      }
    }
    return false;
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === 'BUTTON') {
    if (canAffordProducer(data, event.target.id)) {
      attemptToBuyProducer(data, event.target.id);
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
      } else {
        window.alert("Not enough coffee!");
      }
  }
}

function tick(data) {
  data.coffee+=data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data)
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
