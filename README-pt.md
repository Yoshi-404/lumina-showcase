# Lumina — Estudo Gamificado (Tech Showcase)

> 💡 **Demo ao Vivo:** [Teste o Lumina aqui!](https://luminastudy-seven.vercel.app)
> 🇺🇸 [Read in English](./README.md)

<img width="1280" height="715" alt="スクリーンショット 2026-10-09 9 34 00" src="https://github.com/user-attachments/assets/2fcf20eb-7ae3-4065-9b87-7b7ba5d9d1dc" />

O Lumina é um aplicativo web gamificado desenhado para tornar os estudos um hábito viciante. Este repositório serve como uma **Vitrine Técnica (Showcase)** destacando a engenharia e a lógica por trás de uma das suas principais funcionalidades: **O Heatmap de Consistência (estilo GitHub)**.

*(Nota: O código-fonte completo contendo a economia virtual, integração com o Firebase e os dados proprietários do álbum de turismo são mantidos em um repositório privado para proteger a propriedade intelectual).*

---

## A Funcionalidade: Heatmap de Atividades

Para manter os estudantes motivados, o Lumina rastreia cada sessão de Pomodoro e revisão de Flashcard, visualizando a consistência diária do usuário através de um heatmap dinâmico de 5 níveis de intensidade — exatamente como o gráfico de contribuições do GitHub.

<img width="1280" height="709" alt="スクリーンショット 2026-10-09 9 34 13" src="https://github.com/user-attachments/assets/f1c58e10-33b9-4eaf-96e6-6333ae0b2a2b" />

<img width="1280" height="713" alt="スクリーンショット 2026-10-09 9 34 32" src="https://github.com/user-attachments/assets/e8c65170-0b5b-43f7-a356-62456349fb2d" />

<img width="1280" height="712" alt="スクリーンショット 2026-10-09 9 34 24" src="https://github.com/user-attachments/assets/03effe2f-45d8-4aa3-96b9-6ed723596b4b" />

<img width="1280" height="710" alt="スクリーンショット 2026-10-09 9 34 45" src="https://github.com/user-attachments/assets/407447f4-9702-4ea0-bb9a-ebf839c31926" />

<img width="1280" height="710" alt="スクリーンショット 2026-10-09 9 35 20" src="https://github.com/user-attachments/assets/680a3f02-a7cf-4ad3-9a71-fb530b7ae578" />


### Desafios Técnicos Resolvidos:
1. **Matemática de Datas Dinâmica:** Geração de exatos 365 dias de histórico de trás para frente a partir da data atual, contabilizando anos bissextos e limites de meses.
2. **Renderização de Matriz:** Agrupamento dinâmico de dias em semanas (colunas) para que o layout flua horizontalmente da esquerda para a direita (passado para o presente).
3. **Mapeamento de Dados:** Correspondência eficiente de milhares de timestamps de sessões de estudo vindos do banco de dados NoSQL (Firebase) para seus respectivos blocos no calendário, mantendo a complexidade de tempo em `O(N)`.
4. **Escalonamento de Intensidade de Cores:** Normalização dos minutos diários de estudo em 5 níveis (Level 0 a Level 4) relativos ao recorde pessoal (Personal Best) do usuário, garantindo que o gráfico sempre pareça equilibrado visualmente.

## Código em Destaque

Neste repositório de demonstração, você pode analisar a implementação puramente em Vanilla JS do motor de renderização do Heatmap:

* [`src/heatmap.js`](./src/heatmap.js) — A classe principal responsável por agregar os dados, gerar a matriz e manipular o DOM.

### Espiadinha (Como a matriz é construída):

```javascript
// Gerando a estrutura da matriz de 52 semanas dinamicamente
const weeks = [];
let currentWeek = [];

for (let i = 0; i < 365; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() - (364 - i));
  
  // Calcula a intensidade da atividade
  const minutes = dayStats[dateStr] || 0;
  const level = this.calculateLevel(minutes, maxMinutes);

  currentWeek.push({ date, minutes, level });

  // Se for Sábado (6), quebra para a próxima coluna
  if (date.getDay() === 6 || i === 364) {
    weeks.push(currentWeek);
    currentWeek = [];
  }
}
```

## Stack & Arquitetura
* **Frontend:** Vanilla JS (ES6+), HTML5, Variáveis CSS3 (Zero frameworks pesados).
* **Backend:** Firebase Firestore (NoSQL) & Authentication.
* **Hospedagem:** Vercel (CI/CD conectado à branch principal do repositório privado).

---
*Se você é um recrutador ou desenvolvedor interessado na arquitetura completa, fique à vontade para entrar em contato ou testar o aplicativo em produção!*
