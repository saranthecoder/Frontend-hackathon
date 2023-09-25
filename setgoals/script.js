let add = document.querySelector("#add").addEventListener("click", fun)
let sub = document.querySelector("#sub").addEventListener("click", func)
var c = 0;
var ourUnit;

function func() {
    if (c <= 0) {
        return;
    }
    var unit = document.querySelector("span").innerText = (c = c - 1);


}
function fun() {
    if (c >= 10) {
        return;
    }
    var unit = document.querySelector("span").innerText = (c = c + 1);

}

document.querySelector(".results").addEventListener("click", calfun)


function calfun() {
    let units = document.querySelector("span").innerText;
    let ans = units * 30;
    let unitss;
    // console.log(units)
    // console.log(ans)
    if (ans <= 100) {
        unitss = ans * 10;
    }
    else if (ans <= 200) {
        unitss = (100 * 10)
            + (ans - 100)
            * 15;
    }
    else if (ans <= 300) {
        unitss = (100 * 10)
            + (100 * 15)
            + (ans - 200)
            * 20;
    }
    else {
        unitss = (100 * 10) + (100 * 15) + (100 * 20) + (ans - 300) * 25;
    }
    // Call the function to set the goal position
    ourUnit = document.getElementById('dig').innerText;
    setGoalPosition(ourUnit);
}


function changeBarHeight(input, date) {
    const graph = document.querySelector('.graph');

    // Ensure the graph element exists

    const noOfChildren = graph.children.length;

    //random value for the height of the bar
    const percentEntered = input * 10;

    // console.log(noOfChildren);
    graph.innerHTML = `<div class="bar" id="bar${noOfChildren + 1}"><div class="num">${(percentEntered / 10)}</div></div>`;
    const lastChildId = graph.lastElementChild.id;
    const lastChildClass = graph.lastElementChild.classList;
    document.getElementById(lastChildId).style.height = `${percentEntered}%`;

    function addAfterSelector(selector, content, styles) {
        const styleSheet = document.styleSheets[0]; // Use the appropriate style sheet

        // Create the CSS rule
        const rule = `${selector}::after { content: "${content}"; ${styles} }`;


        //styleSheet.insertRule(rule, styleSheet.cssRules.length);
    }

    // Usage - Assuming lastChildClass is the class of the last element
    addAfterSelector(`.${lastChildClass}`, `${date}`, 'font-size: 14px;position: absolute; bottom: 10px; color: black;margin: -30px -10px;');


}
//random date 
let date = new Date();
//    var currentDate = date.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

date = date.toLocaleString('en-US', { day: 'numeric' }) + "";


//function to run once per day at night 12am
function runAtMidnight(callbackFunction) {
    const now = new Date();
    const timeToMidnight = new Date();
    timeToMidnight.setHours(24, 0, 0, 0); // Set to midnight of the next day

    const timeUntilMidnight = timeToMidnight - now;

    // Run the provided function when it's midnight
    if (timeUntilMidnight <= 1000) {  // Check every second if it's close to midnight
        // Call the provided function
        callbackFunction();

        // Reset the interval to run again tomorrow
        setTimeout(() => runAtMidnight(callbackFunction), 86400000);  // 24 hours in milliseconds
    } else {
        // Check again in a second
        setTimeout(() => runAtMidnight(callbackFunction), 1000);
    }
}



// Start the function to run at midnight with the provided function
runAtMidnight(changeBarHeight(4, date));

function setGoalPosition(input) {

    const setGoal = document.querySelector('.setGoal');
    setGoal.style.display = 'block';
    setGoal.style.top = `${100 - input * 10}%`;
}

const apiUrl = 'http://localhost:8080/';
// const apiUrl = 'https://setgoals-server.onrender.com';
const dataContainer = document.getElementById('data-container');
let goalReached = false;
let halfReached = false;
let nineReached = false;

function fetchData() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Fetch failed with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            setInterval(changeBarHeight(data, date), 1000);
            ourUnit = document.getElementById('dig').innerText;
            console.log(ourUnit)
            console.log(data)
            if (data >= ourUnit && !goalReached && ourUnit > 0) {
                setTimeout(function () {
                    alert("Goal reached! 100% Electricity consumed");
                }, 1000);

                goalReached = true;
            }
            if (data>= ourUnit / 2 && !halfReached && ourUnit > 0) {
                setTimeout(function () {
                    alert("50% Electricity consumed");
                }, 1000);

                halfReached = true;
            }
            if (data >= ourUnit*0.9 && !nineReached && ourUnit > 0) {
                setTimeout(function () {
                    alert("90% Electricity consumed");
                }, 1000);

                nineReached = true;
            }

            // value(data.unit);
        })
        .catch(error => {
            console.error("Error during fetch:", error);
        });

}

// Fetch data initially and then every second
fetchData();
// setInterval(changeBarHeight(1,date), 1000);



setInterval(fetchData, 1000);

