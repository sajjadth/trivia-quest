package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sajjadth/trivia-quest/internals/models"
	"github.com/sajjadth/trivia-quest/internals/services"
)

func GetQuestions(c *gin.Context) {
	var req models.QuestionRequest

	// bind JSON data from the request to the user variable
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "something went wrong please try again later"})
		return
	}

	// get questinos handel errors
	questions, err := services.GetQuestions(req.Amount, req.Category, req.Difficulty, req.QuestionType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "results": questions})
}

func CheckQuestion(c *gin.Context) {
	var req models.QuestionRequest

	// bind JSON data from the request to the user variable
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "something went wrong please try again later"})
		return
	}

	// get username for accessing to database from extracted token in middleware
	username, _ := c.Get("username")

	// check user answer with correct answer and making necessary changes in database
	stat, err := services.CheckQuestion(req.CorrectAnswer, req.UserAnswer, username.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "result": stat})
}
