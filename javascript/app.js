class QuizApp {
    constructor() {
        this.dataManager = new DataManager();
        this.currentQuestion = null;
        this.init();
    }

    init() {
        this.loadQuestion();
        this.updateStats();
        this.renderQuestionList();
    }

    // Tải câu hỏi
    loadQuestion() {
        const result = this.dataManager.getCurrentQuestion();
        if (!result) {
            alert('Không có câu hỏi nào! Hãy thêm câu hỏi mới.');
            return;
        }

        this.currentQuestion = result;
        this.displayQuestion();
    }

    // Hiển thị câu hỏi
    displayQuestion() {
        const { question, index, total } = this.currentQuestion;
        
        document.getElementById('questionNumber').textContent = `${index + 1}/${total}`;
        document.getElementById('mathExpression').textContent = question.function;
        document.getElementById('userAnswer').value = '';
        
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback';
        feedback.style.display = 'none';
        feedback.innerHTML = '';
        
        const solution = document.getElementById('solution');
        solution.style.display = 'none';
        solution.innerHTML = '';
    }

    // Kiểm tra đáp án
    checkAnswer() {
        console.log('=== BẮT ĐẦU KIỂM TRA ===');
        
        const userAnswer = document.getElementById('userAnswer').value.trim();
        if (!userAnswer) {
            alert('Vui lòng nhập đáp án!');
            return;
        }

        console.log('Đáp án người dùng:', userAnswer);
        console.log('Đáp án đúng:', this.currentQuestion.question.answer);

        const isCorrect = this.dataManager.checkAnswer(
            userAnswer,
            this.currentQuestion.question.answer
        );

        console.log('Kết quả:', isCorrect ? 'ĐÚNG' : 'SAI');

        const feedback = document.getElementById('feedback');
        const stats = this.dataManager.updateStats(isCorrect);

        if (isCorrect) {
            feedback.className = 'feedback correct';
            feedback.innerHTML = `
                <strong>✅ Chính xác!</strong><br>
                Đáp án của bạn đúng rồi!
                <div style="margin-top:10px; padding:10px; background:#d4edda; border-radius:5px;">
                    <strong>Đáp án:</strong> ${this.currentQuestion.question.answer}
                </div>
            `;
            feedback.style.display = 'block';
            feedback.style.background = '#d4edda';
            feedback.style.border = '1px solid #c3e6cb';
            feedback.style.color = '#155724';
            feedback.style.padding = '15px';
            feedback.style.borderRadius = '5px';
            feedback.style.marginTop = '10px';
        } else {
            feedback.className = 'feedback incorrect';
            feedback.innerHTML = `
                <strong>❌ Sai rồi!</strong><br>
                <div style="margin-top:10px; padding:10px; background:#ffe6e6; border-radius:5px;">
                    <strong>Đáp án đúng:</strong><br>
                    <code style="background:#fff; padding:5px; display:block; margin:5px 0;">${this.currentQuestion.question.answer}</code>
                </div>
                <small>Hãy thử lại hoặc xem lời giải.</small>
            `;
            feedback.style.display = 'block';
            feedback.style.background = '#f8d7da';
            feedback.style.border = '1px solid #f5c6cb';
            feedback.style.color = '#721c24';
            feedback.style.padding = '15px';
            feedback.style.borderRadius = '5px';
            feedback.style.marginTop = '10px';
        }

        this.updateStats();
        console.log('=== KẾT THÚC KIỂM TRA ===');
    }

    // Hiển thị gợi ý
    showHint() {
        const hint = this.currentQuestion.question.hint;
        const feedback = document.getElementById('feedback');
        feedback.className = 'feedback';
        feedback.style.background = '#fff3cd';
        feedback.style.border = '1px solid #ffc107';
        feedback.style.color = '#856404';
        feedback.innerHTML = '<strong>💡 Gợi ý:</strong><br>' + hint;
        feedback.style.display = 'block';
        feedback.style.padding = '15px';
        feedback.style.borderRadius = '5px';
        feedback.style.marginTop = '10px';
    }

    // Hiển thị lời giải
    showSolution() {
        const solution = this.currentQuestion.question.solution;
        const solutionDiv = document.getElementById('solution');
        solutionDiv.innerHTML = '<strong>📖 Lời giải:</strong><br><pre style="white-space:pre-wrap;">' + solution + '</pre>';
        solutionDiv.style.display = 'block';
        solutionDiv.style.background = '#e7f3ff';
        solutionDiv.style.border = '1px solid #b3d9ff';
        solutionDiv.style.padding = '15px';
        solutionDiv.style.borderRadius = '5px';
        solutionDiv.style.marginTop = '10px';
    }

    // Bỏ qua câu hỏi
    skipQuestion() {
        this.dataManager.skipQuestion();
        this.loadQuestion();
    }

    // Cập nhật thống kê
    updateStats() {
        const stats = this.dataManager.getStats();
        document.getElementById('correctCount').textContent = stats.correct;
        document.getElementById('wrongCount').textContent = stats.wrong;
        document.getElementById('totalCount').textContent = stats.total;
    }

    // Chuyển tab
    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        event.target.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');

        if (tabName === 'list') {
            this.renderQuestionList();
        }
    }

    // Render danh sách câu hỏi
    renderQuestionList() {
        const questions = this.dataManager.getQuestions();
        const listDiv = document.getElementById('questionList');

        if (questions.length === 0) {
            listDiv.innerHTML = '<p style="text-align:center;color:#999;">Không có câu hỏi nào</p>';
            return;
        }

        listDiv.innerHTML = questions.map(q => `
            <div class="question-item ${q.difficulty}">
                <div class="question-item-info">
                    <strong>${q.function}</strong><br>
                    <small>Đáp án: ${q.answer}</small><br>
                    <span class="badge badge-${q.difficulty}">${this.getDifficultyText(q.difficulty)}</span>
                </div>
                <div class="question-item-actions">
                    <button class="btn btn-danger" onclick="app.deleteQuestion(${q.id})">Xóa</button>
                </div>
            </div>
        `).join('');
    }

    getDifficultyText(difficulty) {
        const texts = {
            'easy': 'Dễ',
            'medium': 'Trung bình',
            'hard': 'Khó'
        };
        return texts[difficulty] || difficulty;
    }

    // Thêm câu hỏi
    addQuestion(event) {
        event.preventDefault();

        const functionText = document.getElementById('inputFunction').value;
        const innerFunction = document.getElementById('inputInnerFunction').value;
        const power = document.getElementById('inputPower').value;
        const answer = document.getElementById('inputAnswer').value;
        const hint = document.getElementById('inputHint').value;
        const solution = document.getElementById('inputSolution').value;
        const difficulty = document.getElementById('inputDifficulty').value;

        const questionData = {
            function: functionText,
            innerFunction: innerFunction,
            power: power ? parseFloat(power) : null,
            answer: answer,
            hint: hint || 'Không có gợi ý',
            solution: solution || 'Không có lời giải',
            difficulty: difficulty
        };

        this.dataManager.addQuestion(questionData);
        
        document.getElementById('addQuestionForm').reset();
        
        alert('✅ Đã thêm câu hỏi thành công!');
        this.renderQuestionList();
    }

    // Xóa câu hỏi
    deleteQuestion(id) {
        if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
            this.dataManager.deleteQuestion(id);
            this.renderQuestionList();
        }
    }

    // Xuất dữ liệu JSON
    exportData() {
        const data = this.dataManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'derivative-quiz-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Xuất dữ liệu TXT
    exportToText() {
        const questions = this.dataManager.getQuestions();
        let text = 'DANH SÁCH CÂU HỎI ĐẠO HÀM HÀM HỢP\n';
        text += '='.repeat(50) + '\n\n';

        questions.forEach((q, index) => {
            text += `Câu ${index + 1}:\n`;
            text += `Hàm số: ${q.function}\n`;
            text += `Đáp án: ${q.answer}\n`;
            text += `Độ khó: ${this.getDifficultyText(q.difficulty)}\n`;
            text += '-'.repeat(50) + '\n';
        });

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'derivative-quiz.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Nhập dữ liệu
    importData() {
        const jsonData = document.getElementById('importData').value.trim();
        if (!jsonData) {
            alert('Vui lòng dán dữ liệu JSON vào ô nhập!');
            return;
        }

        const success = this.dataManager.importData(jsonData);
        if (success) {
            alert('✅ Nhập dữ liệu thành công!');
            document.getElementById('importData').value = '';
            this.init();
        } else {
            alert('❌ Lỗi: Dữ liệu JSON không hợp lệ!');
        }
    }

    // Xóa tất cả dữ liệu
    clearAllData() {
        if (confirm('⚠️ Cảnh báo: Bạn có chắc muốn xóa TẤT CẢ dữ liệu?')) {
            if (confirm('Bạn có chắc chắn 100% không?')) {
                this.dataManager.clearAll();
                this.init();
                alert('Đã xóa tất cả dữ liệu!');
            }
        }
    }
}

// Khởi tạo ứng dụng
const app = new QuizApp();