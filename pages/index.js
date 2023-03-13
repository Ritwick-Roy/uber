import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [problemInput, setProblemInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ problem: problemInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setProblemInput("");
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Thapar Student Corner</title>
      </Head>

      <main className={styles.main}>
        <h1>Thapar Student Corner</h1>
        <h2>What's your problem?</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="problem"
            placeholder="Enter your problem"
            value={problemInput}
            onChange={(e) => setProblemInput(e.target.value)}
          />
          <input type="submit" value="Get help" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
