const ApiUrl = "http://localhost:5678/api/";
var CategoryOn = 0
var CategoryOff = 0
var ListCategories = null
var ListWorks = null
var AdminConnected = false
let ModalAdmin = null
let ModalAddWork = null
// EST-ON CONNECTE EN TANT QU'ADMINISTRATEUR (cacher ou afficher éléments HTML selon login/logout)
const token = localStorage.getItem("Token")
console.log(token)
if (token !== null && token !== undefined) {
        AdminConnected = true;
        document.querySelectorAll(".admin_show").forEach((element) => {element.classList.remove('login_logout_hide')});
        document.querySelectorAll(".admin_hide").forEach((element) => {element.classList.add('login_logout_hide');});
    } else {
        AdminConnected = false;
        document.querySelectorAll(".admin_show").forEach((element) => {element.classList.add('login_logout_hide');});
        document.querySelectorAll(".admin_hide").forEach((element) => {element.classList.remove('login_logout_hide');});
        BtnFilters();
    };
    // gestion des FILTRES CATEGORIES
async function BtnFilters() {
    try {
        const response = await fetch(ApiUrl + "categories");
        ListCategories = await response.json();
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
    } catch (error) {
        console.log(`fetch/categories BAD`, error);
    }
};
// gestion des WORKS 
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
//        console.log(ListWorks[ifigure].categoryId,CategoryOn)
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
// gestion modale ADMINISTRATEUR ******************************/
const OpenModalAdmin = function(evenement) {
    console.log("OpenAdmin")
    evenement.preventDefault();
    // récuperer le nom de la modal dans href du btn click
    console.log(document.querySelector(evenement.target.getAttribute('href')))
    ModalAdmin = document.querySelector(evenement.target.getAttribute('href'));
    ModalAdmin.style.display = null;
    ModalAdmin.removeAttribute('aria-hidden');
    ModalAdmin.setAttribute('aria-modal','true');
    ModalAdmin.addEventListener('click', CloseModalAdmin);
    ModalAdmin.querySelector('.js-modal-admin-close').addEventListener('click',CloseModalAdmin);
    ModalAdmin.querySelector('.js-modal-admin-stop').addEventListener('click',stopPropagation);
    document.querySelectorAll(".js-delete-work").forEach(a => {
        a.addEventListener('click',DeleteWork);
    });
};

const CloseModalAdmin = function (e) {
    console.log("closeAdmin")
    if (ModalAdmin === null) return;
    e.preventDefault()
    ModalAdmin.style.display = "none";
    ModalAdmin.setAttribute('aria-hidden','true');
    ModalAdmin.removeAttribute('aria-modal');
    ModalAdmin.removeEventListener('click',CloseModalAdmin);
    ModalAdmin.querySelector('.js-modal-admin-close').removeEventListener('click',CloseModalAdmin);
    ModalAdmin.querySelector('.js-modal-admin-stop').removeEventListener('click',stopPropagation);
    document.querySelectorAll(".js-delete-work").forEach(a => {
        a.removeEventListener('click',DeleteWork);
    });
    ModalAdmin = null;
};

const OpenModalAddWork = function(evenement) {
    console.log("OpenAddWork")
    evenement.preventDefault();
    // récuperer le nom de la modal dans href du btn click
    ModalAddWork = document.querySelector(evenement.target.getAttribute('href'));
    console.log(ModalAddWork)
    ModalAddWork.style.display = null;
    ModalAddWork.removeAttribute('aria-hidden');
    ModalAddWork.setAttribute('aria-modal','true');
    ModalAddWork.addEventListener('click', CloseModalAddWork);
    ModalAddWork.querySelector('.js-modal-add-work-close').addEventListener('click',CloseModalAddWork);
    ModalAddWork.querySelector('.js-modal-add-work-stop').addEventListener('click',stopPropagation);
};

const CloseModalAddWork = function (e) {
    console.log("CloseAddWork")
    if (ModalAddWork === null) return;
    e.preventDefault()
    ModalAddWork.style.display = "none";
    ModalAddWork.setAttribute('aria-hidden','true');
    ModalAddWork.removeAttribute('aria-modal');
    ModalAddWork.removeEventListener('click',CloseModalAddWork);
    ModalAddWork.querySelector('.js-modal-add-work-close').removeEventListener('click',CloseModalAddWork);
    ModalAddWork.querySelector('.js-modal-add-work-stop').removeEventListener('click',stopPropagation);
    ModalAddWork = null;
};


const stopPropagation = function (e) {
    e.stopPropagation();
};

document.querySelectorAll(".js-modal-admin").forEach(a => {
    a.addEventListener('click',OpenModalAdmin);
});

document.querySelectorAll(".js-modal-add-work").forEach(a => {
    a.addEventListener('click',CloseModalAdmin);
    a.addEventListener('click',OpenModalAddWork);
});

const DeleteWork = async function (evenement) {
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
}
//***********************************************************/
// gestion modale AJOUT WORK ********************************/


//            Btn.addEventListener("click", () => {  BS  : NE FONCTIONNE PAS CAR MANQUE FILTER TOUS !!!!
//                CategoryOn = ibtn+1;
//                console.log(CategoryOff,CategoryOn)
//                if (CategoryOn != CategoryOff) {
//                    Btn.classList.remove("filter__btn--active");
//                    Btn.classList.add("filter__btn--active");
//                    if (CategoryOn != 0) {
//                        let CategoryOn = ListWorks.filter(function(work){
//                            return work.category.id == CategoryOn
//                        })
//                        MajWorks(ListWorksCategory)
//                    } else {
//                        MajWorks(ListWorks)
//                    }
//                };
//            });

//const DeleteWork = function (evenement) {
// RESTE A SUPPRIMER Work_Id dans BD et si ok effacer à l'écran    
//    const LabelWork = '.'+evenement.target.getAttribute('id');
//    const Work_Id = evenement.target.getAttribute('Work_Id');
//    console.log(LabelWork,Work_Id)
//    document.querySelectorAll(LabelWork).forEach((elt) => {elt.setAttribute('aria-hidden','true');elt.style.display = "none";});
//    MakeGalleryWorks
//};

