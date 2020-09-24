$(function() {
  $(".error").hide();
  $(".links-container").animate({ "opacity": "1.0" }, 2000);

  const $createQuiz = $("form#create-quiz");
  $createQuiz.on("submit", function(e) {
    if ($("#quiz-title").val() === "" || $("#quiz-description").val() === "" || !$("input[name='isPrivate']:checked").val()) {
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
    if ($("#textbox1").val() === "" || !$("input[name='isCorrecta1']:checked").val()) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    } else if ($("#textbox2").val() === "" || !$("input[name='isCorrecta2']:checked").val()) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    } else if ($("#textbox3").val() === "" || !$("input[name='isCorrecta3']:checked").val()) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return
    } else if ($("#textbox4").val() === "" || !$("input[name='isCorrecta4']:checked").val()) {
      e.preventDefault();
      $(".error").slideDown(1000);
      return;
    }
  });
});
