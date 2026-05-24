/* ============================================================
   1. SLIDER LOGIC (HOME PAGE)
   ============================================================ */
let slideIndex = 0;

function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
    }

    if (dots.length > 0 && dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }

    setTimeout(showSlides, 5000);
}

// Manual dot navigation
function currentSlide(n) {
    slideIndex = n - 1;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        if (dots[i]) dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex].style.display = "block";
    if (dots[slideIndex]) dots[slideIndex].className += " active";
}

/* ============================================================
   2. INTERACTIVE ELEMENTS (DOM CONTENT LOADED)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

    // Start auto‑slider
    showSlides();

    // --- RESELLER MODAL LOGIC ---
    const modal = document.getElementById("resellerModal");
    const openBtn = document.getElementById("openFormBtn");
    const fillUpBtn = document.getElementById("fillUpReseller");
    const closeBtn = document.querySelector(".close_modal");

    function openModal() {
        if (modal) modal.style.display = "block";
    }

    if (openBtn) openBtn.onclick = openModal;
    if (fillUpBtn) fillUpBtn.onclick = openModal;

    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // --- RESELLER FORM SUBMIT LOGIC (FIXED) ---
    const resellerForm = document.getElementById('resellerForm');
    console.log("Form found:", resellerForm);

    if (resellerForm) {
        resellerForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop page refresh

            // 1. Get Reseller vs Distributor radio button
            const typeOptions = document.getElementsByName('type');
            let selectedType = "";
            for (const option of typeOptions) {
                if (option.checked) {
                    selectedType = option.value;
                    break;
                }
            }

            // 2. Collect all input values
            const formData = {
                email: document.getElementById('email').value,
                fullname: document.getElementById('fullname').value,
                phone: document.getElementById('phone').value,
                area: document.getElementById('area').value,
                company: document.getElementById('company').value || "N/A",
                partnershipType: selectedType,
                motivation: document.getElementById('motivation').value,
                dateSubmitted: document.getElementById('submitDate').value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            console.log("Saving to Firestore...", formData);

        db.collection("resellers").add(formData)
            .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
                
                // I-reset ang form at isara ang form modal kung meron
                resellerForm.reset();
                if (modal) modal.style.display = "none";
                document.body.style.overflow = "auto";

                // TAWAGIN ANG CUSTOM MODAL (Dapat Eto lang ang nandito, WALANG ALERT!)
                const customAlert = document.getElementById("customAlertModal");
                if (customAlert) {
                    customAlert.style.display = "flex";
                }
            })
            .catch((error) => {
                console.error("Error adding document:", error);
                alert("Error submitting form. Please check your connection or Firestore rules.");
            });
    });
}

    // --- MOBILE MENU LOGIC ---
    const navMenu = document.getElementById('nav-menu'),
        navToggle = document.getElementById('nav-toggle'),
        navClose = document.getElementById('nav-close');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // --- PRODUCT GRID SLIDER (PREV/NEXT) ---
    const productGrid = document.getElementById('productGrid');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (productGrid && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', function () {
            productGrid.scrollBy({ left: 320, behavior: 'smooth' });
        });
        prevBtn.addEventListener('click', function () {
            productGrid.scrollBy({ left: -320, behavior: 'smooth' });
        });
    }

    // --- CONTACT FORM ALERT (CUSTOM MODAL VERSION) ---
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // 1. Linisin at i-reset ang mga input box ng form
            contactForm.reset();

            // 2. ITO ANG IPALIT SA ALERT: Ipakita ang ating custom success modal
            const contactModal = document.getElementById("contactSuccessModal");
            if (contactModal) {
                contactModal.style.display = "flex";
            }
        });
    }
});

/* ============================================================
   3. GOOGLE MAP + SEARCH BAR (PARTNER STORES)
   ============================================================ */
function initMap() {
    const center = { lat: 14.5995, lng: 120.9842 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6.5,
        center,
        mapTypeControl: false,
        streetViewControl: false,
    });

    const stores = [
        { name: "Dali Everyday Grocery", position: { lat: 14.52, lng: 121.01 } },
        { name: "Puregold Supermarket", position: { lat: 14.55, lng: 121.03 } },
        { name: "Super 8 Grocery", position: { lat: 14.68, lng: 121.05 } },
        { name: "SM Hypermarket Davao", position: { lat: 7.07, lng: 125.61 } },
        { name: "Metro Supermarket Cebu", position: { lat: 10.31, lng: 123.89 } },
        { name: "Landers Alabang", position: { lat: 14.41, lng: 121.03 } },
        { name: "S&R Pampanga", position: { lat: 15.05, lng: 120.68 } },
        { name: "WalterMart Laguna", position: { lat: 14.28, lng: 121.09 } },
        { name: "SM Hypermarket Iloilo", position: { lat: 10.72, lng: 122.55 } },
        { name: "Gaisano Grand Bacolod", position: { lat: 10.67, lng: 122.96 } },
        { name: "Robinsons Supermarket CDO", position: { lat: 8.48, lng: 124.65 } },
        { name: "Savemore Baguio", position: { lat: 16.41, lng: 120.6 } },
        { name: "SM Supermarket GenSan", position: { lat: 6.12, lng: 125.18 } }
    ];

    const infoWindow = new google.maps.InfoWindow();

    stores.forEach(store => {
        const marker = new google.maps.Marker({
            position: store.position,
            map,
            title: store.name
        });
        marker.addListener("click", () => {
            infoWindow.setContent(`<strong>${store.name}</strong>`);
            infoWindow.open(map, marker);
        });
    });

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your city or store name...";
    input.id = "mapSearchBox";
    input.style.cssText = `
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        padding: 10px 15px;
        border: 2px solid #FF0000;
        border-radius: 6px;
        font-size: 14px;
        z-index: 5;
        background-color: #fff;
    `;
    document.getElementById("map").appendChild(input);

    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo("bounds", map);
    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(12);
        }
    });

    input.addEventListener("input", () => {
        const text = input.value.toLowerCase();
        const found = stores.find(s => s.name.toLowerCase().includes(text));
        if (found) {
            map.panTo(found.position);
            map.setZoom(12);
        }
    });
}

// =============================================================
// NAVIGATION TRIGGER LOGIC PARA SA GOOGLE MAPS
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. Hanapin ang lahat ng navigation links sa iyong menu
    const navLinks = document.querySelectorAll(".nav_link");

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            // Suriin kung ang clinick na link ay para sa Partner Stores
            // Tinitingnan nito kung may "partnerstores.html" sa href o kung "PARTNER STORES" ang text
            const isPartnerStores = this.getAttribute("href")?.includes("partnerstores.html") || 
                                    this.textContent.trim().toUpperCase() === "PARTNER STORES";

            if (isPartnerStores) {
                console.log("Partner Stores clicked. Scheduling map initialization...");
                
                // 2. Bigyan ng 300ms delay para hayaang mailatag muna ng iyong system ang HTML section
                setTimeout(() => {
                    if (typeof initMap === "function") {
                        initMap(); // Pwersahang tinatawag at binubuhay ang mapa ulit!
                    } else {
                        console.error("Error: initMap function is not defined!");
                    }
                }, 300);
            }
        });
    });
});

// =============================================================
// GLOBAL CONTROL PARA SA CONSISTENT GOOGLE MAPS NAVIGATION
// =============================================================

// Isang function para sa ligtas na pag-reboot ng mapa
function forceReloadMap() {
    const mapElement = document.getElementById("map");
    
    // Safety Check: Kung wala pa o tinanggal ang #map div sa DOM, huwag pilitin para iwas crash
    if (!mapElement) {
        console.log("Map container element not found yet.");
        return;
    }

    // Linisin ang lahat ng lumang natirang elements (gaya ng nadodobleng search box inputs)
    mapElement.innerHTML = ""; 

    // Tawagin ang iyong initMap() function na may kaunting delay para siguradong nakalatag na ang CSS layout
    setTimeout(() => {
        if (typeof initMap === "function") {
            console.log("Google Maps reloaded successfully!");
            initMap();
        } else {
            console.error("initMap function is missing in script.js");
        }
    }, 200); // 200ms delay para sa transition ng section
}

// Makinig sa pag-load ng buong webpage (First Time Load)
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. FIRST TIME LOAD: Kung ang default page/section pagka-open ay Partner Stores, i-load ang mapa agad
    if (document.getElementById("map")) {
        forceReloadMap();
    }

    // 2. EVERY TIME YOU COME BACK: Makinig sa lahat ng click sa iyong navigation menu
    const navLinks = document.querySelectorAll(".nav_link");

    navLinks.forEach(link => {
        link.addEventListener("click", function() {
            // I-check kung ang pinindot na tab ay ang Partner Stores
            const isPartnerStoresTab = this.getAttribute("href")?.includes("partnerstores.html") || 
                                       this.textContent.trim().toUpperCase() === "PARTNER STORES";

            if (isPartnerStoresTab) {
                console.log("Navigating back to Partner Stores... Triggering map reload.");
                // Pwersahang buhayin ulit ang mapa pagbalik mo sa section na ito
                forceReloadMap();
            }
        });
    });
});


// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBowenv2v9afjSyOTRzfKCPcOzJmVaxsPKU",
    authDomain: "millennium-foods-reseller.firebaseapp.com",
    projectId: "millennium-foods-reseller",
    storageBucket: "millennium-foods-reseller.appspot.com",
    messagingSenderId: "384915155829",
    appId: "1:384915155829:web:e1ae05469438f88c46413c"
};

// 2. Initialize (Check muna kung initialized na para hindi mag-error)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// 3. Form Logic
const resellerForm = document.getElementById('resellerForm');
const modal = document.getElementById('yourFormModalId'); // Palitan mo ng tamang ID ng modal ng mismong FORM kung may hiwalay ka pa doon

if (resellerForm) {
    resellerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log("Saving to Firestore...", resellerForm);

        const formData = {
            email: document.getElementById('email').value,
            fullname: document.getElementById('fullname').value,
            phone: document.getElementById('phone').value,
            area: document.getElementById('area').value,
            dateSubmitted: document.getElementById('submitDate').value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        db.collection("resellers").add(formData)
            .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
                
                // 1. I-reset ang form fields
                resellerForm.reset();
                
                // 2. Isara ang form input modal (kung meron)
                if (modal) modal.style.display = "none";
                document.body.style.overflow = "auto";

                // 3. DIRETSO CUSTOM SUCCESS MESSAGE (Wala nang browser alert)
                const customAlert = document.getElementById("customAlertModal");
                if (customAlert) {
                    customAlert.style.display = "flex";
                }
            })
            .catch((error) => {
                console.error("Error adding document:", error);
                alert("Error submitting form. Please check your connection or Firestore rules.");
            });
    });
}

/* MOBILE MENU TOGGLE */
const hamburger = document.getElementById("hamburgerMenu");
const mobileDrawer = document.getElementById("mobileDrawer");

if(hamburger && mobileDrawer){

    hamburger.addEventListener("click", () => {
        mobileDrawer.classList.toggle("show");
    });

}

// Kunin ang button element mula sa HTML
const backToTopBtn = document.getElementById("backToTop");

// Makikiramdam sa pag-scroll ng user
window.onscroll = function() {
    // Kung lumampas na ng 300px ang scroll pababa, lalabas ang button. Kung hindi, tago ulit.
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.style.display = "flex";
    } else {
        backToTopBtn.style.display = "none";
    }
};

// Kapag clinick ang button, aakyat sa pinakataas ng website
backToTopBtn.addEventListener("click", function() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" /* Smooth transition papuntang itaas */
    });
});