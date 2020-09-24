$(function() {
  $(".error").hide();
  $(".links-container").animate({ "opacity": "1.0" }, 2000);

  const $createQuiz = $("form#create-quiz");
  $createQuiz.on("submit", function(e) {
    if ($("#quiz-title").val() === "" || $("quiz-description").val() === "" || ($("#is-private").val() === null && $("#is-public").val() === null)) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    }
  });

  const $createQuestion = $("#quiz-question");
  $createQuestion.on("submit", function(e) {
    if ($("#question-text").val() === "") {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    }
  });

  const $createAnswers = $("#answers-form");
  $createAnswers.on("submit", function(e) {
    if ($("#textbox1").val() === "" || ($("#is-incorrect1").val() === null && $("#is-correct1").val() === null)) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    } else if ($("#textbox2").val() === "" || ($("#is-incorrect2").val() === null && $("#is-correct2").val() === null)) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    } else if ($("#textbox3").val() === "" || ($("#is-incorrect3").val() === null && $("#is-correct3").val() === null)) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    } else if ($("#textbox4").val() === "" || ($("#is-incorrect4").val() === null && $("#is-correct4").val() === null)) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    }
  });
});
