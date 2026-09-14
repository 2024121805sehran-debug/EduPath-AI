import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { QUIZZES_DATA } from '../data/quizzesData';
import { QuizRunner } from '../components/assessment/QuizRunner';

export const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { recordQuizScore } = useUser();

  const quiz = QUIZZES_DATA.find(q => q.id === quizId) || QUIZZES_DATA[0];

  const handleQuizComplete = (result: {
    scorePercent: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    timeTakenSeconds: number;
  }) => {
    recordQuizScore(
      quiz.id, 
      result.correctCount, 
      result.totalQuestions, 
      quiz.xpReward, 
      quiz.topicId
    );
  };

  const handleExit = () => {
    if (quiz.subjectId) {
      navigate(`/subjects/${quiz.subjectId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleReviewTopic = () => {
    if (quiz.subjectId && quiz.topicId) {
      navigate(`/subjects/${quiz.subjectId}/topics/${quiz.topicId}`);
    } else if (quiz.subjectId) {
      navigate(`/subjects/${quiz.subjectId}`);
    } else {
      navigate('/subjects');
    }
  };

  return (
    <div className="py-6">
      <QuizRunner
        quiz={quiz}
        onQuizComplete={handleQuizComplete}
        onExit={handleExit}
        onReviewTopic={handleReviewTopic}
      />
    </div>
  );
};
