const apiUrl = "http://localhost:5678/api/";
var categoryOn = 0
var categoryOff = 0
var listCategories = null
var listWorks = null
var ifAdminConnected = false
var modalAddWork_OK = false
let modalAdmin = null
let modalGallery  = null
let modalCreate  = null
// ADMIN or GUEST ?
// cacher ou afficher les éléments HTML selon ADMIN/GUEST
const token = localStorage.getItem("token")
if (token !== null && token !== undefined) {
        ifAdminConnected = true;
        document.querySelectorAll(".admin_show").forEach((element) => {element.classList.remove('login_logout_hide')});
        document.querySelectorAll(".admin_hide").forEach((element) => {element.classList.add('login_logout_hide');});
        btnFilters();
    } else {
        ifAdminConnected = false;
        document.querySelectorAll(".admin_show").forEach((element) => {element.classList.add('login_logout_hide');});
        document.querySelectorAll(".admin_hide").forEach((element) => {element.classList.remove('login_logout_hide');});
        btnFilters();
    };
//
// GESTION DES CATEGORIES
//
// récupération des catégories via API
// GUEST : afficher filtres catégories des projets + listeners
// ADMIN : créer liste catégories pour choix ajout projet
async function btnFilters() {
    try {
        const response = await fetch(apiUrl + "categories");
        listCategories = await response.json();
        if (ifAdminConnected === false) {
            const filters = document.querySelector(".filters");
            for (let ibtn = 0; ibtn < listCategories.length; ibtn++) {
                let btn = document.createElement("button");
                btn.className = "filter__btn logout_show filter__btn-id-" + listCategories[ibtn].id;
                btn.ariaLabel = "filtre_ajout_fetch";
                btn.textContent = listCategories[ibtn].name;
                btn.alt = "fetch categorie";
                filters.appendChild(btn);
            }
            const listFilters = document.querySelectorAll(".filter__btn")
            for (let iBtnFilter = 0; iBtnFilter < listFilters.length; iBtnFilter++) {
                listFilters[iBtnFilter].addEventListener("click", () => {
                    categoryOn = iBtnFilter;
                    if (categoryOn != categoryOff) {
                        listFilters[categoryOff].classList.remove("filter__btn--active");
                        listFilters[categoryOn].classList.add("filter__btn--active");
                        makeGalleryWorks()
                    };
                });
            }
        } else {
            const categoriesAdd = document.querySelector("#choice_categorie")
            listCategories.forEach(category => {
            const option = document.createElement("option");
            option.textContent = category.name;
            option.id = category.id;
            option.value = category.id;
            categoriesAdd.appendChild(option);
            })
        }
    } catch (error) {
        console.log(`fetch/categories BAD`, error);
    }
};
//
// GESTION DES PROJETS
//
// récupération des works via API
galleryWorks()
async function galleryWorks() {
    try {
        const response = await fetch(apiUrl + "works");
        listWorks = await response.json();
        makeGalleryWorks()
    } catch (error) {
        console.log(`fetch/works BAD`, error);
    }
};
// CREATION GALLERIE(S)
// GUEST : uniquement page INDEX
// ADMIN : page INDEX et MODAL GALLERIE
function makeGalleryWorks() {
    categoryOff = categoryOn
    const htmlGallery = document.querySelector(".gallery");
    const htmlModalAdminGallery = document.querySelector(".modal-admin-gallery");
    // vider gallerie INDEX
    htmlGallery.innerHTML="" 
    // vider gallerie MODAL
    if (ifAdminConnected === true) {htmlModalAdminGallery.innerHTML=""} 
    // créer les figures PROJET
    for (let ifigure = 0; ifigure < listWorks.length; ifigure++) {
        if(categoryOn == 0 || listWorks[ifigure].categoryId === categoryOn) {
            createHtmlWork(htmlGallery,htmlModalAdminGallery,listWorks[ifigure]);
        }
    }
};
// CREATION de chaque projet en HTML
// GUEST : uniquement page INDEX ADMIN : INDEX + MODAL GALLERIE
function createHtmlWork(htmlGallery,htmlModalAdminGallery,Work) {
// création works dans gallery index
    let figure = document.createElement("figure");
    let figure_Image = document.createElement("img");
    figure_Image.src=Work.imageUrl;
    figure_Image.className = Work.title;
    let figure_figcaption = document.createElement("figcaption");
    figure_figcaption.innerText=Work.title;
    htmlGallery.appendChild(figure)
    figure.appendChild(figure_Image)
    figure.appendChild(figure_figcaption)
// si ADMIN => création works dans gallery modal
    if (ifAdminConnected === true) {
        let figureModal = document.createElement("figure");
        let figureModal_Image = document.createElement("img");
        figureModal_Image.src=Work.imageUrl;
        figureModal_Image.className = Work.title;
        let figureModal_Delete = document.createElement("p");
        let figureModal_DeleteIcon = document.createElement("i");
        figureModal_DeleteIcon.classList = "fa-solid fa-trash-can js-delete-work"; 
        figureModal_DeleteIcon.dataset.idWork = Work.id;
        figureModal_DeleteIcon.addEventListener("click", deleteWork)
        figureModal_Delete.appendChild(figureModal_DeleteIcon);
        htmlModalAdminGallery.appendChild(figureModal)
        figureModal.appendChild(figureModal_Image)
        figureModal.appendChild(figureModal_Delete)
    };
};
//
// gestion des modales ADMINISTRATEUR ******************************/
//
const titleFormAddWork = document.getElementById("title_add_img")
const pictureFormAddWork = document.getElementById("picture")
const categoryFormAddWork = document.getElementById("choice_categorie")
const btnFormAddWork = document.getElementById("btn_modal_add_work")
const areaupload = document.querySelector(".contain_add_picture")
const uploadpic = document.querySelector("#picture")
const btnAddPicture = document.querySelector(".btn_add_picture")
const previewImage = document.querySelector("#preview-img")
const chooseImage = document.getElementById("btn_hover_choose_image")
// OUVRIR la modale principale qui contiendra les éléments
// modale gestion gallerie OU modale ajout projet
// gérer le click hors modale active et stopper la propagation
const openModalAdmin = async function(evenement) {
    evenement.preventDefault();
    // récuperer le nom de la modal dans href du btn click
        modalAdmin = document.querySelector(evenement.target.getAttribute('href'));
        // montrer la modale
        modalAdmin.style.display = null;
        modalAdmin.removeAttribute('aria-hidden');
        modalAdmin.setAttribute('aria-modal','true');
        // ajouter LISTENER CLOSE si click hors zone active
        modalAdmin.addEventListener('click', closeModalAdmin);
        // stopper la propagation CLOSE
        modalAdmin.querySelector('.js-modal-admin-stop').addEventListener('click',stopPropagation);
        await openModalGallery()
};
// FERMER modale principale et supprimer listeners
const closeModalAdmin = async function (e) {
    if (modalAdmin === null) return;
    e.preventDefault()
    // si modale GALLERIE ACTIVE la fermer
    if (modalGallery !== null) {
        await closeModalGallery();
    };
    // si modale AJOUT PROJET ACTIVE la fermer
    if (modalCreate !== null) {
        await closeModalCreate();
    };
    e.preventDefault()
    // cacher la modale ADMIN
    modalAdmin.style.display = "none";
    modalAdmin.setAttribute('aria-hidden','true');
    modalAdmin.removeAttribute('aria-modal');
    // supprimer les listeners
    modalAdmin.removeEventListener('click',closeModalAdmin);
    modalAdmin.querySelector('.js-modal-admin-stop').removeEventListener('click',stopPropagation);
    modalAdmin = null;
};
// MONTRER MODALE gestion GALLERIE + LISTENERS
async function openModalGallery () {
    modalGallery = document.querySelector(".modalGallery");
    modalGallery.style.display = null;
    modalGallery.removeAttribute('aria-hidden');
    modalGallery.querySelector('.js-modalGallery-close').addEventListener('click',closeModalAdmin);
};
// CACHER MODALE gestion GALLERIE - LISTENERS
async function closeModalGallery () {
    if (modalGallery === null) return;
    modalGallery.style.display = "none";
    modalGallery.setAttribute('aria-hidden','true');
    modalGallery.removeEventListener('click', closeModalGallery);
    modalGallery.querySelector('.js-modalGallery-close').removeEventListener('click',closeModalAdmin);
    modalGallery = null;
};
// MONTRER MODALE ajout PROJET + LISTENERS
async function openModalCreate () {
    modalCreate = document.querySelector(".modalCreate");
    modalCreate.style.display = null;
    modalCreate.removeAttribute('aria-hidden');
    modalCreate.querySelector('.js-modalCreate-close').addEventListener('click',closeModalAdmin);
    modalCreate.querySelector('.js-modalGallery-return').addEventListener('click',returnmodalGallery);
    validateAddWork()
};
// CACHER MODALE ajout PROJET + LISTENERS
async function closeModalCreate () {
    if (modalCreate === null) return;
    modalCreate.style.display = "none";
    modalCreate.setAttribute('aria-hidden','true');
    modalCreate.removeEventListener('click',closeModalAdmin);
    modalCreate.querySelector('.js-modalCreate-close').removeEventListener('click',closeModalAdmin);
    modalCreate.querySelector('.js-modalGallery-return').removeEventListener('click',returnmodalGallery);
    titleFormAddWork.value="";
    categoryFormAddWork.value="";
    pictureFormAddWork.value = null;
    pictureFormAddWork.src = "";
    previewImage.src = "";
    modalCreate = null;
};
// RETOUR MODALE GALLERIE depuis MODALE AJOUT PROJET
async function returnmodalGallery () {
    await closeModalCreate();
    await openModalGallery();
};
// DEMANDE OUVERTURE MODALE ADMIN
document.querySelectorAll(".js-modal-admin").forEach(a => {
    a.addEventListener('click',openModalAdmin);
});
// ALLER MODALE AJOUT PROJET depuis MODALE GALLERIE
const gotoModalAddWork = document.querySelector(".js-modal-add-work")
gotoModalAddWork.addEventListener("click", async () => {
    await closeModalGallery();
    await openModalCreate();
});
// ARRETER LA PROPAGATION CLOSE si CLICK (sur partie active de la modale)
const stopPropagation = function (e) {
    e.stopPropagation();
};
// effet sur VISU DE LA PHOTO CHOISIE (selon position souris)
document.querySelectorAll(".mouse_over_out_pic").forEach((a) => {
    a.addEventListener('mouseover',mouseOverPic);
    a.addEventListener('mouseout',mouseOutPic);
});
function mouseOverPic () {
    const sizeUpload = pictureFormAddWork.files.length > 0
    if(sizeUpload){
        areaupload.style.filter = "brightness(0.7)";
        chooseImage.style.opacity = "1";
    };
};
function mouseOutPic () {
    const sizeUpload = pictureFormAddWork.files.length > 0
    if(sizeUpload){
        areaupload.style.filter = "brightness(1)";
        chooseImage.style.opacity = "0";
    };
};
// VISUALISATION DE LA PHOTO CHOISIE (si format et size OK)
function previewUpload(){
    areaupload.addEventListener("change", async () =>{
        const file = await uploadpic.files[0]
        if(file){
        const isValidFile = checkFile(file)
            if (isValidFile) {
                previewImage.src = URL.createObjectURL(file);
                previewImage.style["min-width"] = "176px";
                previewImage.style["min-height"] = "168px";
            } else {
                // Affichage d'un message d'erreur si le fichier n'est pas valide
                alert("Le fichier doit être un JPG ou un PNG et ne doit pas dépasser 4 Mo.")
                // Effacer la sélection du fichier
                uploadpic.value = ""; 
                previewImage.src = "";
                previewImage.style["min-width"] = ""
                previewImage.style["min-height"] = ""
            }
        } else{
            previewImage.src = ""
        }
    areaupload.style.filter = "brightness(1)";
    chooseImage.style.opacity = "0";
    })
};
previewUpload()

// ACTIVER OU DESACTIVER BOUTON SUBMIT AJOUT PHOTO
titleFormAddWork.addEventListener("input", validateAddWork)
pictureFormAddWork.addEventListener("change", validateAddWork)
categoryFormAddWork.addEventListener("change", validateAddWork)

// TESTS SI éléments du PROJET tous OK ? (titre photo catégorie)
function validateAddWork() {
    // Verification du contenue présent ou non dans les différentes sections du formulaire.
    const titleFilled = titleFormAddWork.value.trim() != "";
    const sizeUpload = pictureFormAddWork.files.length > 0
    const categorySelected = categoryFormAddWork.value != "";
    // Activer/ Désactiver le bouton submit en fonction des champs remplis ou non 
    if (titleFilled && sizeUpload && categorySelected){
        btnFormAddWork.style.backgroundColor = "#1D6154";
        btnFormAddWork.style.borderColor = "#1D6154";
        modalAddWork_OK = true;
    }
    else {
        btnFormAddWork.style.backgroundColor = "#7A7A7A";
        btnFormAddWork.style.borderColor = "#7A7A7A";
        modalAddWork_OK = false;
    };
};
// test si format PHOTO OK ?
function checkFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png']
    const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
    // Vérification du type de fichier
    return (allowedTypes.includes(file.type) && file.size < maxSize) 
};
//
// AJOUT DU PROJET SUITE A SUBMIT
//
const formulaireAddWork = document.querySelector("#form_add_work")
formulaireAddWork.addEventListener("submit", async (event) =>{
    event.preventDefault();
    if(modalAddWork_OK = false){return}; // projet non conforme
    // vérifier que c'est bien l'évènement "bouton submit"
    if(event.submitter.id !== "btn_modal_add_work"){return};
    // Récupération des éléments saisis par l'utilisateur
    const pictureAdd = event.target.querySelector("[name=picture]").files[0]
    const titleAdd = event.target.querySelector("[name=title_add_img]").value
    var categoryChoiceId =  event.target.querySelector("[name=choice_categorie_add]").value
    // construction et preparation du formdata
    const newWork = new FormData();
    newWork.append("image", pictureAdd);
    newWork.append("title", titleAdd);
    newWork.append("category", categoryChoiceId);
    // Envoie des données a l'API
    try {
        const reponse = await fetch(apiUrl + "works", {
            method: "POST", 
            headers: {"Authorization": `Bearer ${token}`},
            body: newWork
        });
        if (reponse.ok){
            // regénérer les galleries (sortir et ouvrir modale gallerie)
            await galleryWorks();
            await closeModalCreate();
            await openModalGallery();
        }
        else {
            console.error(`Erreur lors de l'ajout du nouveau projet !`)
        };
    }
    catch (error){
        console.error("Error", error)
    };
});
//
// SUPPRESSION D'UN PROJET
//
const deleteWork = async function (evenement) {
    evenement.preventDefault();
    // récupérer l'ID du projet à supprimer
    Work_Id = evenement.target.dataset.idWork
    // supprimer le projets de la BD
    try {
        await fetch(`http://localhost:5678/api/works/${Work_Id}`, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`
            }
        })
        await galleryWorks()
    }
    catch(error){
        console.log(error);
    }
};

