import axios from 'axios';
import cors from 'cors';

getLocation();

async function getLocation() {

    window.addEventListener('load', (event) => {
        getCoordinates();
    });

    function getCoordinates() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.")
        }
    }

    async function showPosition(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        document.querySelector('#myLatitude').innerHTML = latitude.toPrecision(7);
        document.querySelector('#myLongitude').innerHTML = longitude.toPrecision(7);

        let config = {
            method: 'get',
            url: (`http://api.positionstack.com/v1/reverse?access_key=<your api key>&query=${latitude},${longitude}`),
            headers: {}
        };

        const res = await axios(config);
        const resData = await JSON.stringify(res.data.data[0].label);

        setInterval(async() => {
            const resISS = await axios({
                method: 'get',
                url: 'https://api.wheretheiss.at/v1/satellites/25544',
                headers: {}
            })

            const resISSData = await JSON.parse(JSON.stringify(resISS.data));
            const issObject = {
                "latitude": resISSData["latitude"].toPrecision(7),
                "longitude": resISSData["longitude"].toPrecision(7),
                "altitude": new Number(resISSData["altitude"].toPrecision(7)).toFixed(1),
                "velocity": new Number(resISSData["velocity"].toPrecision(10)).toFixed(1),
                "timeStamp": new Date(resISSData["timestamp"]).toLocaleTimeString("en-US"),
                "visibility": resISSData["visibility"]
            }

            var iss_velocity = issObject.velocity;
            var iss_altitude = issObject.altitude;
            var updatedSpeedVel = Math.round(iss_velocity * 180 / 10000) - 45;
            var updatedSpeedAlt = Math.round(iss_altitude * 180 / 100) - 45;

            $("#speedbox-score-issVelcoity").css("transform", "rotate(" + updatedSpeedVel + "deg)");
            document.getElementById("speedbox-issVelocity").innerHTML = iss_velocity;

            $("#speedbox-score-issAltitude").css("transform", "rotate(" + updatedSpeedAlt + "deg)");
            document.querySelector('#speedbox-issAltitude').innerHTML = iss_altitude;

            document.querySelector('#iss_latitude').innerHTML = issObject.latitude;
            document.querySelector('#iss_longitude').innerHTML = issObject.longitude;
            document.querySelector('#iss_velocity').innerHTML = issObject.velocity + ' km/h';
            document.querySelector('#iss_altitude').innerHTML = issObject.altitude + ' m';
            document.querySelector('#iss_timeStamp').innerHTML = issObject.timeStamp;
            document.querySelector('#iss_status').innerHTML = (issObject.visibility).charAt(0).toUpperCase() + (issObject.visibility).slice(1);
        }, 2000);

        document.querySelector('#myLocation').innerHTML = resData.slice(1, -1);
        document.querySelector('#myLocalTime').innerHTML = new Date().toLocaleTimeString('en-US');

    }

}

var popUpModal = document.getElementById('popUpModal')
popUpModal.addEventListener('show.bs.modal', function(event) {
    // Button that triggered the modal
    var button = event.relatedTarget;
    var modalTitle = popUpModal.querySelector('.modal-title')
        // Update the modal's content.
    var modalBody = popUpModal.querySelector('.modal-body')

    if (button.id == "liveVideoToggle") {
        button = event.relatedTarget;
        modalTitle.textContent = "Live ISS Video";
        modalBody.innerHTML = "";
        modalBody.innerHTML = `<iframe width="470" height="315" src="https://www.youtube-nocookie.com/embed/Y1qQZbTF8iQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else if (button.id == "imageToggle") {
        modalTitle.textContent = "ISS Modules";
        modalBody.innerHTML = "image toggled";
    } else if (button.id == "passesToggle") {
        modalTitle.textContent = "Pass Alerts";
        modalBody.innerHTML = "Loading..."
        
        function getDirection(angle) {
            var directions = ['S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW', 'W', 'WSW', 'SW', 'SSW'];
            var index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 22.5) % 16;
            return directions[index];
        }
        
        function geUserLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.watchPosition(showPosition);
            } else {
                x.innerHTML = "Geolocation is not supported by this browser.";
            }
        }

        async function showPosition(position) {
            
            function genDate(date) {
                var year = date.substring(0, 4);
                var month = date.substring(4, 6);
                var day = date.substring(6, 8);
                var hour = date.substring(8, 10);
                var min = date.substring(10, 12);
                var sec = date.substring(12, 14);

                var newDate = new Date(year, month - 1, day).toDateString();
                return `${newDate} ${hour}: ${min}: ${sec}`
            }
            
            const getPassesRes = await axios({
                method: 'get',
                url: `https://api.scraperapi.com?api_key=<your sraperapi api key>&url=https://www.astroviewer.net/iss/ws/predictor.php?sat=25544&lon=${position.coords.longitude}&lat=${position.coords.latitude}&time=1666008000`,
                headers: {}
            })

            const getPasses = await JSON.parse(JSON.stringify(getPassesRes.data))["passes"];
            console.log(getPasses)

            modalBody.innerHTML = ""

            getPasses.forEach(e => {
                modalBody.innerHTML += `<div class="conjunctions-wrapper">
                    <div class="conjunction">
                    <div>
                        <p>Pass Time</p>
                        <span><a>Date: </a><a>${genDate(e.begin)}</a></span>
                        <span><a>Magnitude: </a><a>${e.mag}</a></span>
                        <span><a>Visible Radius: </a><a >${e.visibRad}</a></span>
                    </div>
                    <div>
                        <p>Sighting Details</p>
                        <span><a>Start: </a><a>${genDate(e.begin)}</a></span>
                        <span><a>Start Altitude: </a><a>${e.beginAlt}</a></span>

                        <span><a>Start Direction: </a><a>${(e.beginDir)}</a></span>

                        <span><a>Max: </a><a>${genDate(e.max)}</a></span>
                        <span><a>Max Altitude: </a><a>${e.maxAlt}</a></span>

                        <span><a>Max Direction: </a><a>${(e.maxDir)}</a></span>


                        <span><a>End: </a><a>${genDate(e.end)}</a></span>
                        <span><a>End Altitude: </a><a>${e.endAlt}</a></span>

                        <span><a>End Direction: </a><a>${(e.endDir)}</a></span>


                    </div>
                </div>
            </div>`
            });
            return getPasses
        }
        geUserLocation();
    } else {
        modalTitle.textContent = "Conjunction Alert";
        modalBody.innerHTML = "Loading..."

        async function getConjunction() {
            const res = await axios({
                method: 'get',
                url: 'https://conjunction.azurewebsites.net/',
                headers: {},
            });
            const resData = await JSON.parse(JSON.stringify(res.data));
            console.log(resData)
            const modal = document.querySelector('.modal-body');
            modal.innerHTML = ""

            for (let item = 0; item < resData.length; item++) {
                modal.innerHTML += `<div class="conjunctions-wrapper">
                <div class="conjunction">
                <div>
                    <p>Object Details</p>
                    <span><a>Object: </a><a id="conjunction_object">${resData[item].object.name}</a></span>
                    <span><a>NORAD ID: </a><a id="conjunction_objectId">${resData[item].object.noradId}</a></span>
                    <span><a>Days Since Epoch: </a><a id="conjunction_object_dse">${resData[item].object.daysSinceEpoch}</a></span>
                </div>
                <div>
                    <p>Conjunction Details</p>
                    <span><a>Start: </a><a id="conjunction_start">${resData[item].conjunction.start}</a></span>
                    <span><a>Probability: </a><a id="conjunction_probability">${resData[item].conjunction.probability}</a></span>
                    <span><a>Dilution Threshold: </a><a id="dlt">${resData[item].conjunction.dilutionThreshold} km</a></span>
                    <span><a>Minimum Range: </a><a id="conjunction_minRange">${resData[item].conjunction.minRange} km</a></span>
                    <span><a>Velocity: </a><a id="conjunction_velocity">${resData[item].conjunction.velocity} km/sec</a></span>
                    <span><a>TCA: </a><a id="conjunction_tca">${resData[item].conjunction.tca}</a></span>
                    <span><a>Stop: </a><a id="conjunction_stop">${resData[item].conjunction.stop}</a></span>
                </div>
            </div>
        </div>`;
            }
        }

        getConjunction();
    }
})
