class DataManager {
    constructor() {
        this.storage = new StorageManager();
    }

    getQuestions() {
        return this.storage.getData().questions;
    }

    getCurrentQuestion() {
        const data = this.storage.getData();
        const questions = data.questions;
        if (questions.length === 0) return null;
        
        const index = data.currentQuestionIndex % questions.length;
        return {
            question: questions[index],
            index: index,
            total: questions.length
        };
    }

    nextQuestion() {
        const data = this.storage.getData();
        data.currentQuestionIndex++;
        this.storage.saveData(data);
        return this.getCurrentQuestion();
    }

    skipQuestion() {
        return this.nextQuestion();
    }

    checkAnswer(userAnswer, correctAnswer) {
        const normalize = (str) => {
            return str.toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/\*/g, '')
                      .replace(/×/g, '')
                      .replace(/\^/g, '^');
        };

        const normalizedUser = normalize(userAnswer);
        const normalizedCorrect = normalize(correctAnswer);

        if (normalizedUser === normalizedCorrect) {
            return true;
        }

        return this.checkMathematicalEquivalence(userAnswer, correctAnswer);
    }

    checkMathematicalEquivalence(userAnswer, correctAnswer) {
        const clean = (str) => str.toLowerCase().replace(/\s/g, '');
        const user = clean(userAnswer);
        const correct = clean(correctAnswer);

        if (user === correct) return true;
        
        return false;
    }

    getStats() {
        return this.storage.getData().stats;
    }

    updateStats(isCorrect) {
        const data = this.storage.getData();
        if (isCorrect) {
            data.stats.correct++;
        } else {
            data.stats.wrong++;
        }
        data.stats.total++;
        this.storage.saveData(data);
        return data.stats;
    }

    addQuestion(questionData) {
        return this.storage.addQuestion(questionData);
    }

    deleteQuestion(id) {
        this.storage.deleteQuestion(id);
    }

    exportData() {
        return this.storage.exportData();
    }

    importData(jsonData) {
        return this.storage.importData(jsonData);
    }

    clearAll() {
        this.storage.clearAll();
    }
}