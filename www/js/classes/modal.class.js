class Modal extends Base{

  constructor(films, viewings,app){
      super();
      this.app = app;
      this.films = films;
      this.viewings = viewings;
      this.movieRuntime;
      this.htmlStarRatings = [];
      this.toggleBookingModal();
      this.toggleInfoModal();
      this.idBtn;
      this.indexToOpen;
      this.eventHandler();
      this.allMovieDates = [];
      this.selectDate;
      this.dateString;
      this.editedDate;
      this.totalPrice;
      this.auditorium;
      this.selectedSeats = [];
      this.totalTickets;
      this.adultTickets;
      this.childTickets;
      this.seniorTickets;
      this.seatsAreProposed = false;
      this.booking = new Booking(this);
      JSON._load('/booking/bookingNumber').then((data) => {
        this.bookingNumber = data.bookingNumber;
      });
  }

  getViewingIndex() {
    let date = `2018-${this.selectDate.split('/')[0]}-${this.selectDate.split('/')[1].split(" ")[0]}`
    let selectedViewing = {
        auditorium: this.currentAuditorium,
        film: this.films[this.indexToOpen].title,
        date: date,
        time: this.selectDate.split('/')[1].split(" ")[1],
    }
    let indexOfViewing = this.viewings.findIndex(viewing =>
        viewing.auditorium == selectedViewing.auditorium &&
        viewing.film == selectedViewing.film &&
        viewing.date == selectedViewing.date &&
        viewing.time == selectedViewing.time);
    return indexOfViewing;
}
      
  toggleBookingModal() {
    let that = this;
    $(document).on("click", '.btn-booking', function() {
      typeof that.app.auditorium == 'undefined' ? that.app.auditorium = new Auditorium(that):null;
      that.currentAuditorium = $('#date-select').find(':selected').attr('data-auditorium');
      $('#infoModal').modal('hide');

      that.adultTickets = 1;
      that.childTickets = 0;
      that.seniorTickets = 0;
      that.totalPrice = that.adultTickets * 95;


      that.totalTickets = 1;
      
      that.app.auditorium.totalSeats = 1;
      that.allMovieDates = [];
      that.idBtn = $(this).attr('id');
      let index = 0;
      for (let film of that.films) {
        let idFilm ='bookingModalToggle'+film.title.replace(/\s+/g, '');
        if (idFilm == that.idBtn) {  
          for(let viewing of that.viewings){
          if(film.title == viewing.film){
            that.allMovieDates.push(viewing.date + ' ' + viewing.time + '%' + viewing.auditorium);
          }
        }
          $('.modal-container-booking').empty();
          that.indexToOpen = index;
        }
        index++;
      }

      that.render('.modal-container-booking', 1);
      $('#bookingModal').modal('toggle');
      
      $(".confirm-booking").prop("disabled", true);
      that.renderShowingTime();
      that.showDateAndTime();
      $('#showTime').text(that.selectDate + ' i ' + that.currentAuditorium);
    });
  }


  renderShowingTime() {
    let that = this;
    for(let i = 0; i < that.allMovieDates.length; i++){
      that.dateString = that.allMovieDates[i];
      let indexOfHyphen = that.allMovieDates[i].indexOf('-');
      let slicedDate = that.allMovieDates[i].slice(indexOfHyphen+1);
      that.editedDate = slicedDate.replace('-', '/')
      let indexOfPercent = that.editedDate.indexOf('%');
      let currentAuditorium = that.editedDate.slice(indexOfPercent+1);
      that.editedDate = that.editedDate.slice(0, indexOfPercent)
      $('.select-date').append(`
          <option data-auditorium='${currentAuditorium}'>${that.editedDate}</option>
        `)
    }
  }

  showDateAndTime() {
    let that = this;
    that.selectDate = $('#date-select option:selected').text();
    that.currentAuditorium = $('#date-select').find(':selected').attr('data-auditorium');
    $('.select-date').change(function () {
      that.selectDate = $('#date-select option:selected').text();
      that.app.auditorium.totalSeats = that.totalTickets;
      that.currentAuditorium = $(this).find(':selected').attr('data-auditorium');
      that.app.auditorium.renderAuditorium(that.currentAuditorium);
      $('#showTime').empty();
      $('#showTime').text(that.selectDate + ' i ' + that.currentAuditorium);
    })
  }

  htmlMovieRatings() {
    let stars = [];
    for (let i = 0; i < this.films[this.indexToOpen].reviews.length; i++) {
      stars[i] = [];
      for (let ii = 0; ii < this.films[this.indexToOpen].reviews[i].max; ii++) {
        if (ii < this.films[this.indexToOpen].reviews[i].stars) {
          stars[i].push('<span class="fa fa-star checked"></span>');
        } else {
          stars[i].push('<span class="fa fa-star"></span>');
        }
      }
      let review = `
        <div class="col-6 col-lg-4 mb-3 mt-3 review">
          <h6 class="mb-1"><span class="text-red">${this.films[this.indexToOpen].reviews[i].source}</span></h6>
          <p class="mb-1">${this.films[this.indexToOpen].reviews[i].quote}</p>
          <span class="text-center">${stars[i].join("")}</span>
        </div>
      `;
      this.htmlStarRatings[i] = [];
      this.htmlStarRatings[i].push(review);
    }
  }

  toggleInfoModal() {
    let that = this;
    $(document).on("click", '.btn-info', function () {
      that.idBtn = $(this).attr('id');
      let index = 0;
      for (let film of that.films) {
        let idFilm = 'infoModalToggle' + film.title.replace(/\s+/g, '');
        if (idFilm == that.idBtn) {
          $('.modal-container-info').empty();
          that.indexToOpen = index;
        }
        index++;
      }
      that.stringifyMovieRuntime();
      that.htmlMovieRatings();
      that.render('.modal-container-info', 2);
      $('#infoModal').modal('toggle');
    });
  }

  stringifyMovieRuntime() {
    let m = this.films[this.indexToOpen].length % 60;
    let h = (this.films[this.indexToOpen].length - m) / 60;
    this.movieRuntime = `${h.toString()} tim ${(m<10? "0": "")}${m.toString()} min`;
  }

  checkIfConfirmBookingIsActive(){
    if (this.totalTickets <= $('.selected').length) {
      $(".confirm-booking").prop("disabled", false);
    } else {
      $(".confirm-booking").prop("disabled", true);
    }
  }

  eventHandler() {
    let that=this;
    $(document).on('hide.bs.modal','#infoModal', function (e) {
      $('#infoModal').empty();
    });

    $(document).on('shown.bs.modal','#bookingModal', function (e) {
      $('body').addClass('modal-open');
      that.app.auditorium.renderAuditorium(that.allMovieDates[0].split("%")[1]);
    });


      
      
    

    $(document).on('click', '#add-adult, #add-child, #add-senior, #sub-adult, #sub-child, #sub-senior', function (event) {
      let id = event.target.id;
      
      if (id == 'add-adult') {
        that.adultTickets++;
        $('#adultTickets').text(that.adultTickets);
      } else if (id == 'add-child') {
        that.childTickets++;
        $('#childTickets').text(that.childTickets);
      } else if (id == 'add-senior') {
        that.seniorTickets++;
        $('#seniorTickets').text(that.seniorTickets);
      } else if (id == 'sub-adult') {
        if (that.adultTickets == 0) {
          return;
        }
        $('.selected').removeClass('selected');
        that.adultTickets--;
        $('#adultTickets').text(that.adultTickets);
      } else if (id == 'sub-child') {
        if (that.childTickets == 0) {
          return;
        }
        $('.selected').removeClass('selected');
        that.childTickets--;
        $('#childTickets').text(that.childTickets);
      } else if (id == 'sub-senior') {
        if (that.seniorTickets == 0) {
          return;
        }
        $('.selected').removeClass('selected');
        that.seniorTickets--;
        $('#seniorTickets').text(that.seniorTickets);
      }
      that.totalTickets = that.adultTickets+that.childTickets+that.seniorTickets;
      that.app.auditorium.totalSeats = that.totalTickets;
      
      that.totalPrice = that.childTickets * 55 + that.adultTickets * 95 + that.seniorTickets * 65;
      $('.total-price').text('Summa: ' + that.totalPrice + ' kr');
      that.checkIfConfirmBookingIsActive();
    })
  }

}