package models

type QuestionList struct {
	ResponseCode int         `json:"response_code"`
	Questions    []*Question `json:"results"`
}

type Question struct {
	Category         string   `json:"category"`
	CorrectAnswer    string   `json:"correct_answer"`
	Difficulty       string   `json:"difficulty"`
	IncorrectAnswers []string `json:"incorrect_answers"`
	Question         string   `json:"question"`
	Type             string   `json:"type"`
}

type QuestionRequest struct {
	Amount       int    `json:"amount"`
	Category     int    `json:"category"`
	Difficulty   string `json:"difficulty"`
	QuestionType string `json:"question_type"`
}

type SerializedQuestionResponse struct {
	Category      string   `json:"category"`
	CorrectAnswer string   `json:"correct_answer"`
	Difficulty    string   `json:"difficulty"`
	Options       []string `json:"options"`
	Question      string   `json:"question"`
	Type          string   `json:"type"`
}

func (q *Question) ToSerializedQuestion() *SerializedQuestionResponse {
	return &SerializedQuestionResponse{
		Category:      q.Category,
		CorrectAnswer: q.CorrectAnswer,
		Difficulty:    q.Difficulty,
		Options:       q.IncorrectAnswers,
		Question:      q.Question,
		Type:          q.Type,
	}
}
