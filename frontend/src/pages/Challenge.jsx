import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";

// The Challenge page: the student proves a skill by answering practical
// questions (and, for JavaScript, writing code that passes hidden tests).
// The SERVER does all the grading, so the result can be trusted.
const Challenge = () => {
  const { skill } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [answers, setAnswers] = useState({});
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadChallenge = async () => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    setError("");
    try {
      const res = await api.get(`/challenges/${encodeURIComponent(skill)}`);
      setChallenge(res.data);
      setCode(res.data.codeChallenge?.starterCode || "");
    } catch (err) {
      setChallenge(null);
      setError(err.response?.data?.message || "Could not load this challenge");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skill]);

  const allAnswered = challenge && challenge.questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post(`/challenges/${encodeURIComponent(skill)}/submit`, {
        answers,
        code,
        codeId: challenge.codeChallenge?.id,
      });
      setResult(res.data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit your answers");
    } finally {
      setSubmitting(false);
    }
  };

  // Lets the Tab key insert spaces inside the code box instead of leaving it.
  const handleCodeKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.target;
      const next = code.slice(0, selectionStart) + "  " + code.slice(selectionEnd);
      setCode(next);
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2;
      });
    }
  };

  if (loading) return <div className="page-loading">Loading challenge...</div>;

  if (!challenge) {
    return (
      <div className="form-page">
        <h1>{skill} challenge</h1>
        <div className="alert alert-error">{error}</div>
        <Link to="/roadmap" className="btn btn-outline">
          Back to roadmap
        </Link>
      </div>
    );
  }

  const resultFor = (id) => result?.questionResults.find((r) => r.id === id);

  return (
    <div className="challenge-page">
      <Link to="/roadmap" className="back-link">
        Back to roadmap
      </Link>
      <h1>Prove your {challenge.skill} skills</h1>
      <p className="page-subtitle">
        Answer {challenge.questions.length} practical questions
        {challenge.codeChallenge ? " and solve one coding task" : ""}. You need {challenge.passMarkPercent}% on
        the questions
        {challenge.codeChallenge ? " and every coding test passing" : ""} to earn the verified badge.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      {result && (
        <div className={`result-banner ${result.passed ? "result-pass" : "result-fail"}`}>
          <h2>{result.passed ? "Verified" : "Not verified yet"}</h2>
          <p>{result.message}</p>
          <p className="result-scores">
            Questions: {result.quizScore}%
            {result.codeScore !== null && <> &nbsp;|&nbsp; Code: {result.codeScore}%</>}
            &nbsp;|&nbsp; Overall: {result.score}%
          </p>
          <div className="result-actions">
            {result.passed ? (
              <Link to="/roadmap" className="btn btn-primary btn-sm">
                Continue your roadmap
              </Link>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={loadChallenge}>
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {challenge.questions.map((q, i) => {
          const r = resultFor(q.id);
          return (
            <fieldset
              key={q.id}
              className={`question-card ${r ? (r.correct ? "question-correct" : "question-wrong") : ""}`}
              disabled={Boolean(result)}
            >
              <legend>Question {i + 1}</legend>
              <p className="question-text">{q.text}</p>
              {q.code && <pre className="code-block">{q.code}</pre>}
              <div className="options">
                {q.options.map((option, idx) => (
                  <label key={idx} className={`option ${answers[q.id] === idx ? "option-selected" : ""}`}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[q.id] === idx}
                      onChange={() => setAnswers({ ...answers, [q.id]: idx })}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {r && !r.correct && <p className="explanation">{r.explanation}</p>}
              {r && r.correct && <p className="explanation explanation-ok">Correct</p>}
            </fieldset>
          );
        })}

        {challenge.codeChallenge && (
          <fieldset className="question-card" disabled={Boolean(result)}>
            <legend>Coding task: {challenge.codeChallenge.title}</legend>
            <p className="question-text">{challenge.codeChallenge.prompt}</p>
            <div className="examples">
              {challenge.codeChallenge.examples.map((ex, i) => (
                <p key={i}>
                  <code>
                    {challenge.codeChallenge.functionName}({ex.input})
                  </code>{" "}
                  should return <code>{ex.expected}</code>
                </p>
              ))}
            </div>
            <textarea
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleCodeKeyDown}
              spellCheck="false"
              rows={12}
              aria-label="Your solution"
            />

            {result?.codeResult && (
              <div className="test-results">
                <h4>
                  Tests passed: {result.codeResult.passedCount} of {result.codeResult.total}
                </h4>
                {result.codeResult.details.map((d) => (
                  <p key={d.test} className={d.status === "passed" ? "test-pass" : "test-fail"}>
                    Test {d.test}{d.hidden ? " (hidden)" : ""}: {d.status}
                    {!d.hidden && d.status === "failed" && (
                      <>
                        {" "}
                        - input <code>{d.input}</code>, expected <code>{d.expected}</code>, got{" "}
                        <code>{d.received}</code>
                      </>
                    )}
                    {d.message && <span className="test-message"> {d.message}</span>}
                  </p>
                ))}
              </div>
            )}
          </fieldset>
        )}

        {!result && (
          <button className="btn btn-primary btn-lg" disabled={!allAnswered || submitting}>
            {submitting ? "Grading..." : "Submit for grading"}
          </button>
        )}
        {!result && !allAnswered && <p className="step-note">Answer every question to submit.</p>}
      </form>
    </div>
  );
};

export default Challenge;
