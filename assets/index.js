const ApiUrl = "http://localhost:5678/api/";
var CategoryOn = 0
var CategoryOff = 0
var ListCategories = null
var ListWorks = null
var AdminConnected = false
var ModalAddWork_OK = false
let ModalAddWork = null
let ModalOn = 0
let ModalAfter = 1
let ModalAdmin = null
let Modal1  = null
let Modal2  = null
var SelectedPicture = false
//
// EST-ON CONNECTE EN TANT QU'ADMINISTRATEUR (cacher ou afficher éléments HTML selon login/logout)
//
const token = localStorage.getItem("Token")
if (token !== null && token !== undefined) {
        AdminConnected = true;
        document.querySelectorAll(".admin_show").forEach((element) => {element.classList.remove('login_logout_hide')});
        document.querySelectorAll(".admin_hide").forEach((element) => {element.classList.add('login_logout_hide');});
        BtnFilters();
    } else {
        AdminConnected = false;
        document.querySelectorAll(".admin_show").forEach((element) => {element.classList.add('login_logout_hide');});
        document.querySelectorAll(".admin_hide").forEach((element) => {element.classList.remove('login_logout_hide');});
        BtnFilters();
    };
//
// gestion des FILTRES CATEGORIES
//
async function BtnFilters() {
    try {
        const response = await fetch(ApiUrl + "categories");
        ListCategories = await response.json();
        if (AdminConnected === false) {
            const filters = document.querySelector(".filters");
            for (let ibtn = 0; ibtn < ListCategories.length; ibtn++) {
                let Btn = document.createElement("button");
                Btn.className = "filter__btn logout_show filter__btn-id-" + ListCategories[ibtn].id;
                Btn.ariaLabel = "filtre_ajout_fetch";
                Btn.textContent = ListCategories[ibtn].name;
                Btn.alt = "fetch categorie";
                filters.appendChild(Btn);
            }
            const ListFilters = document.querySelectorAll(".filter__btn")
            for (let iBtnFilter = 0; iBtnFilter < ListFilters.length; iBtnFilter++) {
                ListFilters[iBtnFilter].addEventListener("click", () => {
                    CategoryOn = iBtnFilter;
                    if (CategoryOn != CategoryOff) {
                        ListFilters[CategoryOff].classList.remove("filter__btn--active");
                        ListFilters[CategoryOn].classList.add("filter__btn--active");
                        MakeGalleryWorks()
                    };
                });
            }
        } else {
            const categoriesAdd = document.querySelector("#choice_categorie")
            ListCategories.forEach(category => {
            const option = document.createElement("option");
            option.textContent = category.name;
            option.id=category.id;
            categoriesAdd.appendChild(option);
            })
        }
    } catch (error) {
        console.log(`fetch/categories BAD`, error);
    }
};
//
// gestion des WORKS 
//
Works()
async function Works() {
    try {
        const response = await fetch(ApiUrl + "works");
        ListWorks = await response.json();
        MakeGalleryWorks()
    } catch (error) {
        console.log(`fetch/works BAD`, error);
    }
};

function MakeGalleryWorks() {
    CategoryOff=CategoryOn
    const HtmlGallery = document.querySelector(".gallery");
    const HtmlModalAdminGallery = document.querySelector(".modal-admin-gallery");
    HtmlGallery.innerHTML=""
    if (AdminConnected === true) {HtmlModalAdminGallery.innerHTML=""}
        for (let ifigure = 0; ifigure < ListWorks.length; ifigure++) {
        if(CategoryOn == 0 || ListWorks[ifigure].categoryId === CategoryOn) {
            CreateHtmlWork(HtmlGallery,HtmlModalAdminGallery,ListWorks[ifigure]);
        }
    }
};

function CreateHtmlWork(HtmlGallery,HtmlModalAdminGallery,Work) {
// création works dans gallery index
let LabelWork = "Work_Id-"+Work.id;
    let Figure = document.createElement("figure");
    Figure.className = LabelWork;
    let Figure_Image = document.createElement("img");
    Figure_Image.src=Work.imageUrl;
    Figure_Image.className = Work.title;
    let Figure_figcaption = document.createElement("figcaption");
    Figure_figcaption.innerText=Work.title;
    HtmlGallery.appendChild(Figure)
    Figure.appendChild(Figure_Image)
    Figure.appendChild(Figure_figcaption)
// si ADMIN => création works dans gallery modal
    if (AdminConnected === true) {
        let FigureModal = document.createElement("figure");
        FigureModal.className = LabelWork;
        let FigureModal_Image = document.createElement("img");
        FigureModal_Image.src=Work.imageUrl;
        FigureModal_Image.className = Work.title;
        let FigureModal_Delete = document.createElement("p");
        let FigureModal_DeleteIcon = document.createElement("i");
        FigureModal_DeleteIcon.classList = "fa-solid fa-trash-can js-delete-work"; 
        FigureModal_DeleteIcon.id = LabelWork;
        FigureModal_DeleteIcon.setAttribute('Work_Id',Work.id);
        FigureModal_Delete.appendChild(FigureModal_DeleteIcon);
        HtmlModalAdminGallery.appendChild(FigureModal)
        FigureModal.appendChild(FigureModal_Image)
        FigureModal.appendChild(FigureModal_Delete)
    };
};
//
// gestion modale ADMINISTRATEUR ******************************/
//
const titleFormAddWork = document.getElementById("title_add_img")
const pictureFormAddWork = document.getElementById("picture")
const categoryFormAddWork = document.getElementById("choice_categorie")
const btnFormAddWork = document.getElementById("btn_modal_add_work")
const areaupload = document.querySelector(".contain_add_picture")
const uploadpic = document.querySelector("#picture")
const btnAddPicture = document.querySelector(".btn_add_picture")
const previewImage = document.querySelector("#preview-img")
const ChooseImage = document.getElementById("btn_hover_choose_image")

const OpenModalAdmin = async function(evenement) {
    evenement.preventDefault();
    // récuperer le nom de la modal dans href du btn click
        ModalAdmin = document.querySelector(evenement.target.getAttribute('href'));
        ModalAdmin.style.display = null;
        ModalAdmin.removeAttribute('aria-hidden');
        ModalAdmin.setAttribute('aria-modal','true');
        ModalAdmin.addEventListener('click', CloseModalAdmin);
        ModalAdmin.querySelector('.js-modal-admin-stop').addEventListener('click',stopPropagation);
        await OpenModal1()
};

const CloseModalAdmin = async function (e) {
    if (ModalAdmin === null) return;
    e.preventDefault()
    if (Modal1 !== null) {
        await CloseModal1();
    };
    if (Modal2 !== null) {
        await CloseModal2();
    };
    e.preventDefault()
    ModalAdmin.style.display = "none";
    ModalAdmin.setAttribute('aria-hidden','true');
    ModalAdmin.removeAttribute('aria-modal');
    ModalAdmin.removeEventListener('click',CloseModalAdmin);
    ModalAdmin.querySelector('.js-modal-admin-stop').removeEventListener('click',stopPropagation);
    ModalAdmin = null;
};

async function OpenModal1 () {
    Modal1 = document.querySelector(".modal1");
    Modal1.style.display = null;
    Modal1.removeAttribute('aria-hidden');
    Modal1.querySelector('.js-modal1-close').addEventListener('click',CloseModalAdmin);
    document.querySelectorAll(".js-delete-work").forEach(a => {
        a.addEventListener('click',DeleteWork);
    });
};

async function CloseModal1 () {
    if (Modal1 === null) return;
    Modal1.style.display = "none";
    Modal1.setAttribute('aria-hidden','true');
    Modal1.removeEventListener('click', CloseModal1);
    Modal1.querySelector('.js-modal1-close').removeEventListener('click',CloseModalAdmin);
    document.querySelectorAll(".js-delete-work").forEach(a => {
        a.removeEventListener('click',DeleteWork);
    });
    Modal1 = null;
};

async function OpenModal2 () {
    Modal2 = document.querySelector(".modal2");
    Modal2.style.display = null;
    Modal2.removeAttribute('aria-hidden');
    Modal2.querySelector('.js-modal2-close').addEventListener('click',CloseModalAdmin);
    Modal2.querySelector('.js-modal1-return').addEventListener('click',ReturnModal1);
    validateAddWork()
};

async function ReturnModal1 () {
    await CloseModal2();
    await OpenModal1();
};

async function CloseModal2 () {
    if (Modal2 === null) return;
    Modal2.style.display = "none";
    Modal2.setAttribute('aria-hidden','true');
    Modal2.removeEventListener('click',CloseModalAdmin);
    Modal2.querySelector('.js-modal2-close').removeEventListener('click',CloseModalAdmin);
    Modal2.querySelector('.js-modal1-return').removeEventListener('click',ReturnModal1);
    titleFormAddWork.value="";
    categoryFormAddWork.value="";
    pictureFormAddWork.value = null;
    pictureFormAddWork.src = "";
    previewImage.src = "";
    Modal2 = null;
};


document.querySelectorAll(".js-modal-admin").forEach(a => {
    a.addEventListener('click',OpenModalAdmin);
});

const GotoModalAddWork = document.querySelector(".js-modal-add-work")
GotoModalAddWork.addEventListener("click", async () => {
    await CloseModal1();
    await OpenModal2();
});

const stopPropagation = function (e) {
    e.stopPropagation();
};

// VISULALISATION DE LA PHOTO CHOISIE
document.querySelectorAll(".mouse_over_pic").forEach((a) => {
    a.addEventListener('mouseover',MouseOverPic);
    a.addEventListener('mouseout',MouseOutPic);
});

function MouseOverPic () {
    const SizeUpload = pictureFormAddWork.files.length > 0
    if(SizeUpload){
        areaupload.style.filter = "brightness(0.7)";
        ChooseImage.style.opacity = "1";
    };
};

function MouseOutPic () {
    const SizeUpload = pictureFormAddWork.files.length > 0
    if(SizeUpload){
        areaupload.style.filter = "brightness(1)";
        ChooseImage.style.opacity = "0";
    };
};

//areaupload.addEventListener("mouseover", () =>{
//    const SizeUpload = pictureFormAddWork.files.length > 0
//
//    if(SizeUpload){
//        ChooseImage.style.display = null;
//        ChooseImage.removeAttribute('aria-hidden');
//        areaupload.style.filter = "brightness(0.7)";
//    };
//});
//areaupload.addEventListener("mouseout", () =>{
//    ChooseImage.style.display = "none";
//    ChooseImage.setAttribute('aria-hidden','true');
//    areaupload.style.filter = "brightness(1)";
//});

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
    ChooseImage.style.opacity = "0";
    })
};
previewUpload()

// ACTIVER OU DESACTIVER BOUTON SUBMIT AJOUT PHOTO
titleFormAddWork.addEventListener("input", validateAddWork)
pictureFormAddWork.addEventListener("change", validateAddWork)
categoryFormAddWork.addEventListener("change", validateAddWork)

function validateAddWork() {
    console.log(previewImage.src,titleFormAddWork.value.trim(),categoryFormAddWork.value)
    // Verification du contenue présent ou non dans les différentes sections du formulaire.
    const titleFilled = titleFormAddWork.value.trim() != "";
    const SizeUpload = pictureFormAddWork.files.length > 0
//    const previewSrc = pictureFormAddWork.src != "";
    const categorySelected = categoryFormAddWork.value != "";
    console.log(titleFilled,SizeUpload,categorySelected)
    // Activer/ Désactiver le bouton submit en fonction des champs remplis ou non 
    if (titleFilled && SizeUpload && categorySelected){
        btnFormAddWork.style.backgroundColor = "#1D6154";
        btnFormAddWork.style.borderColor = "#1D6154";
        ModalAddWork_OK = true;
    }
    else {
        btnFormAddWork.style.backgroundColor = "#7A7A7A";
        btnFormAddWork.style.borderColor = "#7A7A7A";
        ModalAddWork_OK = false;
    };
};

function checkFile(file) {
    const allowedTypes = ['image/jpeg', 'image/png']
    const maxSize = 4 * 1024 * 1024; // 4 Mo en octets
    // Vérification du type de fichier
    return (allowedTypes.includes(file.type) && file.size < maxSize) 
};

// AJOUT DU PROJET SUITE A SUBMIT
const formulaireAddWork = document.querySelector("#form_add_work")
formulaireAddWork.addEventListener("submit", async (event) =>{
    event.preventDefault();
    if(ModalAddWork_OK = false){return};
    if(event.submitter.id !== "btn_modal_add_work"){return};
    // Récupération de la saisie utilisateur
    const pictureAdd = event.target.querySelector("[name=picture]").files[0]
    const titleAdd = event.target.querySelector("[name=title_add_img]").value
    const categoryChoiceName =  event.target.querySelector("[name=choice_categorie_add]").value
    var categoryChoiceId = 0
    for (let ibtn = 0; ibtn < ListCategories.length; ibtn++) {
        if (categoryChoiceName == ListCategories[ibtn].name){
            categoryChoiceId = ListCategories[ibtn].id
        }
    }

    // construction et preparation du formdata
    const NewWork = new FormData()
    NewWork.append("image", pictureAdd)
    NewWork.append("title", titleAdd)
    NewWork.append("category", categoryChoiceId)
    // Envoie des données a l'API
    try {
        const reponse = await fetch(ApiUrl + "works", {
            method: "POST", 
            headers: {"Authorization": `Bearer ${token}`},
            body: NewWork
        })
        if (reponse.ok){
            // regénérer les galleries
            await Works();
            await CloseModal2();
            await OpenModal1();
        }
        else {
            console.error(`Erreur lors de l'ajout du nouveau projet !`)
        }
    }
    catch (error){
        console.error("Error", error)
    }
});

// SUPPRESSION D'UN PROJET
const DeleteWork = async function (evenement) {
    evenement.preventDefault();
    Work_Id = evenement.target.getAttribute('Work_Id');
    // supprimer le projets de la BD
    try {
        await fetch(`http://localhost:5678/api/works/${Work_Id}`, {
            method: "DELETE",
            headers: {"Authorization": `Bearer ${token}`
            }
        })
    // supprimer les listeners Delete
        document.querySelectorAll(".js-delete-work").forEach(a => {
            a.removeEventListener('click',DeleteWork);
        });
    // regénérer les galleries
        await Works()
    // créer les listeners Delete
        document.querySelectorAll(".js-delete-work").forEach(a => {
            a.addEventListener('click',DeleteWork);
        });
    }
    catch(error){
        console.log(error)
    }
};

