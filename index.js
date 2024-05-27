$(document).ready(function(){
    let test = {
        display: null,
        taskInput: null,
        addTaskBtn: null,
        cancelBtn: null,
        tasks: [],
        modal: null,
        modalImage: null,
        modalTrigger: null,
        todoLink: null,
        galleryLink: null,
        thumbnailSize: null,
        todoSection: null,
        gallerySection: null,
        apiKey: null,
        apiUrl: null,
        response: null,
        data: null,
        city: null,
        temp: null,
        humidity: null,
        windSpeed: null,
        locationInput: null,
        searchBtn: null,
        weatherIcon:null,
        weatherData:null,
        card:null,
        details:null,
        weatherLink:null,
        index:null,
        images:[],
        prev:null,
        next:null,
        weatherContainer:null,

        init: function() {
            this.display = $("#taskList");
            this.addTaskBtn = $("#addTaskBtn");
            this.taskInput = $("#taskInput");
            this.loadTasksFromLocalStorage();
            this.modal = $('#imageModal');
            this.modalImage = $('#modalImage');
            this.modalTrigger = $(".modal-trigger");
            this.todoLink = $("#todoLink");
            this.galleryLink = $("#galleryLink");
            this.thumbnailSize = $(".thumbnail-size");
            this.todoSection = $("#todoSection");
            this.gallerySection = $("#gallerySection");
            this.weatherContainer=$(".weatherContainer");
            this.apiKey = "f6a6380cc8fbade7eea6eb13be18f488";
            this.apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" + this.apiKey + "&q=";
            this.city = $(".city");
            this.temp = $(".temp");
            this.humidity = $(".humidity");
            this.windSpeed = $(".windSpeed");
            this.locationInput = $(".locationInput");
            this.searchBtn = $(".searchIconWrap");
            this.weatherIcon=$(".weatherIcon");
            this.weatherData=$(".weatherData");
            this.details=$(".details");
            this.card = $(".weatherCard");
            this.weatherLink=$(  "#weatherLink");
            this.index=0;
            this.images=$(".img-fluid").get();
            this.prev=$(".prev");
            this.next=$(".next");
            
        },

        eventHandler: function() {
            this.gallerySection.hide();
            this.weatherContainer.hide();
            let that = this;

            this.addTaskBtn.click(function() {
                if ($(this).text() === "Update Task") {
                    that.updateTask();
                } else {
                    that.addTask();
                }
                that.saveTasksToLocalStorage();
            });

            this.display.on("click", ".deleteBtn", function() {
                let taskIndex = $(this).closest("label").index();
                $(this).closest("label").remove();
                that.tasks.splice(taskIndex, 1);
                that.saveTasksToLocalStorage();
            });

            this.display.on("click", ".editBtn", function() {
                if(that.taskInput.val()==''){
                    let taskLabel = $(this).closest("label");
                    let taskText = taskLabel.find("span").text();
                    that.taskInput.val(taskText);
                    that.addTaskBtn.text("Update Task");
                    that.addTaskBtn.data("task-id", taskLabel.index());
                    that.cancelBtn = $("<button>").text("Cancel").addClass("btn btn-secondary cancelBtn me-2");
                    that.cancelBtn.appendTo(that.addTaskBtn.parent());
                    that.cancelBtn.click(function() {
                        that.taskInput.val("");
                        that.addTaskBtn.text("Add Task");
                        that.cancelBtn.remove();
                    });
                }
             
            });

            this.prev.click(function(){
                that.prevImage();
            });

            this.next.click(function(){
                that.nextImage();
            })
            this.modalTrigger.click(function() {
                let imageSrc = $(this).attr("src");
                that.modalImage.attr("src", imageSrc);
                if ($(window).width() < 768) {
                    that.thumbnailSize.removeClass("img-fluid");
                }
            });

            this.todoLink.click(function(e) {
                e.preventDefault();
                that.todoSection.show();
                that.gallerySection.hide();
                that.weatherContainer.hide();
                that.updateActiveClass($(this));

            });

            this.galleryLink.click(function(e) {
                e.preventDefault();
                that.todoSection.hide();
                that.gallerySection.show();
                that.weatherContainer.hide();
                that.updateActiveClass($(this));

            });
            this.weatherLink.click(function(e){
                e.preventDefault();
                that.weatherContainer.show();
                that.gallerySection.hide();
                that.todoSection.hide();
                that.updateActiveClass($(this));
            });
            this.searchBtn.click(function() {
                let location = that.locationInput.val(); 
                if (location) {
                    that.weatherData.css("display", "block");
                    that.searchWeather(location);
                    that.locationInput.val("");
                }
            });
        },
        prevImage:function(){
            
            this.index--;
            if(this.index<0){
                this.index=this.images.length-1;
            }
            this.showImage(this.index);
        },
        nextImage:function(){
            this.index++;
            if(this.index>=this.images.length){
                this.index=0;
            }
            this.showImage(this.index);

        },
        showImage: function(index) {
            let selectedImage = $(this.images[index]).attr("src");
            this.modalImage.attr("src", selectedImage);
        },
        updateActiveClass:function(navItem){
            $(".nav-link").removeClass("active");
            navItem.addClass("active");

        },

        addTask: function() {
            let taskText = this.taskInput.val();
            if (taskText === "") {
                return;
            }
            this.addTaskToDisplay(taskText);
            this.tasks.push(taskText);
            this.taskInput.val("");
        },

        updateTask: function() {
            let taskId = this.addTaskBtn.data("task-id");
            let taskText = this.taskInput.val();
            if (taskText === "") {
                return;
            }
            let taskLabel = this.display.find("label").eq(taskId);
            taskLabel.find("span").text(taskText);
            this.tasks[taskId] = taskText;
            this.taskInput.val("");
            this.addTaskBtn.text("Add Task");
            this.cancelBtn.remove();
        },

        saveTasksToLocalStorage: function() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        },

        loadTasksFromLocalStorage: function() {
            let storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
                this.tasks.forEach(task => {
                    this.addTaskToDisplay(task);
                });
            }
        },

        addTaskToDisplay: function(taskText) {
            let label = $("<label>").addClass("list-group-item d-flex justify-content-between align-items-center");
            let checkbox = $("<input>").addClass("form-check-input me-1").attr({
                type: "checkbox",
                value: ""
            });
            let textSpan = $("<span>").addClass("flex-grow-1").text(taskText);
            let buttonsDiv = $("<div>").addClass("d-flex align-items-center");
            let deleteBtn = $("<button>").text("Delete").addClass("btn btn-danger deleteBtn me-2");
            let editBtn = $("<button>").text("Edit").addClass("btn btn-secondary editBtn");
            checkbox.appendTo(label);
            textSpan.appendTo(label);
            deleteBtn.appendTo(buttonsDiv);
            editBtn.appendTo(buttonsDiv);
            buttonsDiv.appendTo(label);
            label.appendTo(this.display);
        },
        searchWeather: async function(location) {
            try {
                const response = await fetch(this.apiUrl + location);
                if (!response.ok) {
                    throw new Error('not found');
                }
                this.data = await response.json();
                this.city.html(this.data.name);
                this.temp.html(Math.round(this.data.main.temp) + '°c');
                this.humidity.html(this.data.main.humidity + '%');
                this.windSpeed.html(this.data.wind.speed + ' kmph');
                const iconCode = this.data.weather[0].icon;
                const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
                this.weatherIcon.attr("src", iconUrl);
                this.weatherIcon.attr("alt", this.data.weather[0].description);
                this.weatherData.addClass("show");
                this.details.addClass("show");
                } 
            catch (error) {
                console.error(' problem with fetch', error);
            }
        }
    };
  

    test.init();
    test.eventHandler();
});
