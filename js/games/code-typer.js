// Code Typer — type Unity C# snippets in 45 seconds. Score = correct characters.
import { shuffle } from "./_kit.js";

const SNIPPETS = [
  "transform.Translate(Vector3.forward * speed * Time.deltaTime);",
  "rb.AddForce(Vector2.up * jumpForce, ForceMode2D.Impulse);",
  "if (Input.GetKeyDown(KeyCode.Space)) Jump();",
  "StartCoroutine(SpawnEnemies(2f));",
  "Instantiate(coinPrefab, spawnPoint.position, Quaternion.identity);",
  "public float speed = 5f;",
  "Destroy(gameObject, 0.5f);",
  "animator.SetTrigger(\"Attack\");",
  "yield return new WaitForSeconds(1f);",
  "Debug.Log(\"Level complete!\");",
  "score += 10 * combo;",
  "var hit = Physics.Raycast(ray, out RaycastHit info, 100f);",
  "SceneManager.LoadScene(\"MainMenu\");",
  "audioSource.PlayOneShot(coinSfx);",
  "transform.rotation = Quaternion.Euler(0, angle, 0);",
];

export default function start({ stage, setScore, gameOver, beep }) {
  const DURATION = 45;
  const list = shuffle(SNIPPETS.slice());
  let k = 0, correct = 0, left = DURATION, started = false, clock, ended = false;

  stage.innerHTML = `<div class="g-wrap ct">
    <div class="g-bar mono"><span>Time: <b id="ctTime">${DURATION}</b>s</span><span>Chars: <b id="ctChars">0</b></span></div>
    <pre class="ct-target mono" id="ctTarget"></pre>
    <input class="ct-input mono" id="ctInput" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Start typing to begin…" aria-label="Type the code shown above" />
    <p class="ct-hint">Press Enter when the line is fully correct to get the next one.</p></div>`;
  const target = stage.querySelector("#ctTarget");
  const input = stage.querySelector("#ctInput");
  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  function render() {
    const want = list[k % list.length], typed = input.value;
    let html = "";
    for (let i = 0; i < want.length; i++) {
      const ch = esc(want[i]);
      if (i < typed.length) html += `<span class="${typed[i] === want[i] ? "ok" : "bad"}">${ch}</span>`;
      else if (i === typed.length) html += `<span class="cur">${ch}</span>`;
      else html += ch;
    }
    target.innerHTML = html;
  }
  function liveScore() {
    const want = list[k % list.length];
    let partial = 0; for (let i = 0; i < input.value.length && input.value[i] === want[i]; i++) partial++;
    return correct + partial;
  }
  input.addEventListener("input", () => {
    if (ended) return;
    if (!started) {
      started = true;
      clock = setInterval(() => {
        left--; stage.querySelector("#ctTime").textContent = left;
        if (left <= 0) { clearInterval(clock); ended = true; input.disabled = true; const s = liveScore(); gameOver(s, `${Math.round((s / 5) / (DURATION / 60))} WPM`); }
      }, 1000);
    }
    const want = list[k % list.length];
    const last = input.value.length - 1;
    if (last >= 0) beep(input.value[last] === want[last] ? 600 : 180, 0.02);
    render();
    const s = liveScore();
    stage.querySelector("#ctChars").textContent = s;
    setScore(s);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || ended) return;
    e.preventDefault();
    if (input.value === list[k % list.length]) { correct += input.value.length; k++; input.value = ""; beep(880, 0.08, "triangle"); render(); }
    else beep(150, 0.1, "sawtooth");
  });
  render();
  setTimeout(() => input.focus({ preventScroll: true }), 60);

  return () => clearInterval(clock);
}
