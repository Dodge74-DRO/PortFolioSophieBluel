const ApiUrl = "http://localhost:5678/api/";
var CategoryOn = 0
var CategoryOff = 0
var ListCategories = null
var ListWorks = null
var AdminConnected = false

localStorage.getItem("AdminTokenSophieBluel");
localStorage.removeItem("AdminTokenSophieBluel");
CreateBtnCategories();


// gestion des FILTRES CATEGORIES
async function CreateBtnCategories() {
    try {
        const response = await fetch(ApiUrl + "categories");
        ListCategories = await response.json();
        const filters = document.querySelector(".filters");
        for (let ibtn = 0; ibtn < ListCategories.length; ibtn++) {
            let NewFilter = document.createElement("button");
            NewFilter.className = "filter__btn logout_show filter__btn-id-" + ListCategories[ibtn].id;
            NewFilter.ariaLabel = "filtre_ajout_fetch";
            NewFilter.textContent = ListCategories[ibtn].name;
            NewFilter.alt = "fetch categorie";
            filters.appendChild(NewFilter);
        }
        ListFilters = document.querySelectorAll(".filter__btn")
        for (let iBtnFilter = 0; iBtnFilter < ListFilters.length; iBtnFilter++) {
            ListFilters[iBtnFilter].addEventListener("click", () => {
                CategoryOn = iBtnFilter;
                if (CategoryOn != CategoryOff) {
                    ListFilters[CategoryOff].classList.remove("filter__btn--active");
                    ListFilters[CategoryOn].classList.add("filter__btn--active");
                    if (CategoryOn != 0) {
                        let ListWorksCategory = ListWorks.filter(function(work){
                            return work.category.id == CategoryOn
                        })
                        MajWorks(ListWorksCategory)
                    } else {
                        MajWorks(ListWorks)
                    }
                };
            });
        }
    } catch (error) {
        console.log(`fetch/categories BAD`, error);
    }
    //    console.log("toto");
};
// gestion des WORKS 
CreateWorks()
async function CreateWorks() {
    try {
        const response = await fetch(ApiUrl + "works");
        ListWorks = await response.json();
//        console.log(ListWorks);
        MajWorks(ListWorks)
    } catch (error) {
        console.log(`fetch/works BAD`, error);
    }
    //    console.log("toto");
};
function MajWorks(ListWorks) {
//    console.log(CategoryOn,CategoryOff)
    CategoryOff=CategoryOn
    const HtmlGallery = document.querySelector(".gallery");
    HtmlGallery.innerHTML=""
    for (let ifigure = 0; ifigure < ListWorks.length; ifigure++) {
        let Figure = document.createElement("figure");
        let Figure_Image = document.createElement("img");
        let Figure_figcaption = document.createElement("figcaption");
        Figure.className = "Figure__Categorie-"+ListWorks[ifigure].category.id;
//        console.log(Figure.className)
        Figure_Image.src=ListWorks[ifigure].imageUrl;
        Figure_Image.className = ListWorks[ifigure].title;
        Figure_figcaption.innerText=ListWorks[ifigure].title;
        HtmlGallery.appendChild(Figure)
        Figure.appendChild(Figure_Image)
        Figure.appendChild(Figure_figcaption)
//        console.log(ListWorks[ifigure].title);
    }
};