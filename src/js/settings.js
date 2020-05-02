const storage = require('electron-json-storage');
const { remote } = require('electron')
const path = require('path');

//opens my github page
function openGithub() {
    require('electron').shell.openExternal("https://github.com/PedroQuadrado");
}

//Armazena temporariamente as configurações do user
let tempMeasure = "metric";
let city = "";
function setTempMeasure(temp) {
    tempMeasure = temp;
}
function setCity() {
    city = document.getElementById("city").value;
    //lat = document.getElementById("lat").innerHTML;
    //lon = document.getElementById("lon").innerHTML;
}
//Armazena as defeniçoes no ficheiro settings.json faz redirect para a pagina weather
function storeData() {
    setCity()
    if (city != "") {
        storage.set('settings', { city: city, tempMeasure: tempMeasure }, function (error) {
            if (error) throw error;
            remote.getCurrentWindow().loadURL(path.join(__dirname, "weather.html"))
        });
    } else {
        alert("Please select your city")
    }
}

//Recolhe o nome de todas as cidades
const countries = new Array()
fetch('../data/city.list.json')
    .then(res => res.json())
    .then((data) => {
        for (let i = 0; i < 209579; i++) {
            let x = data[i].name + ", " + data[i].country + "<i>" + data[i].coord.lat + "<i>" + data[i].coord.lon + "<i></i></i></i>";
            countries.push(x);
        }
        function autocomplete(inp, arr) {
            var currentFocus;

            inp.addEventListener("input", function (e) {
                var a, b, i, val = this.value;
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false; }
                currentFocus = -1;
                /*create a DIV element that will contain the items (values):*/
                a = document.createElement("div");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                this.parentNode.appendChild(a);
                /*for each item in the array...*/
                for (i = 0; i < arr.length; i++) {
                    /*check if the item starts with the same letters as the text field value:*/
                    if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("div");
                        /*make the matching letters bold:*/
                        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].substr(val.length);
                        /*insert a input field that will hold the current array item's value:*/
                        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function (e) {
                            /*insert the value for the autocomplete text field:S
                                and splits the sting to get lat and lon values
                            */
                            let text = this.getElementsByTagName("input")[0].value
                            let split = text.split("<i>");
                            inp.value = split[0];
                            let lat = split[1];
                            let lon = split[2];
                            storage.set('coords', { lat: lat, lon: lon }, function (error) {
                                if (error) throw error;
                            });

                            /*close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                }
            });
            /*execute a function presses a key on the keyboard:*/
            inp.addEventListener("keydown", function (e) {
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode == 40) {
                    /*If the arrow DOWN key is pressed,
                    increase the currentFocus variable:*/
                    currentFocus++;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode == 38) { //up
                    /*If the arrow UP key is pressed,
                    decrease the currentFocus variable:*/
                    currentFocus--;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode == 13) {
                    /*If the ENTER key is pressed, prevent the form from being submitted,*/
                    e.preventDefault();
                    if (currentFocus > -1) {
                        /*and simulate a click on the "active" item:*/
                        if (x) x[currentFocus].click();
                    }
                }
            });
            function addActive(x) {
                /*a function to classify an item as "active":*/
                if (!x) return false;
                /*start by removing the "active" class on all items:*/
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                /*add class "autocomplete-active":*/
                x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
                /*a function to remove the "active" class from all autocomplete items:*/
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("autocomplete-active");
                }
            }
            function closeAllLists(elmnt) {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        }

        autocomplete(document.getElementById("city"), countries);

    });
/*An array containing all the country names in the world:*/

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
