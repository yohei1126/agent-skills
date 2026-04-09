---
name: sales-agent
description: "Sales intelligence skill for querying deals, pipeline, rep performance, and sales conversations. Use when the user asks about sales metrics, deal values, win rates, pipeline health, rep performance, revenue, quota, product line analysis, or sales conversation transcripts. Triggers: sales, deals, pipeline, revenue, win rate, rep performance, quota, product line, sales conversation, transcript."
license: MIT
compatibility: Designed for Cortex Code CLI. Requires an active Snowflake connection with access to the SALES_INTELLIGENCE database and the SALES_INTELLIGENCE_RL role.
metadata:
  author: yohei1126
  version: "3.1"
---

## When to Use

- User asks about deals, revenue, pipeline, win rates, or sales rep performance
- User asks about sales conversations, customer sentiment, or objections
- User requests a sales report, performance review, or pipeline analysis
- User mentions specific sales reps, customers, or product lines from the SALES_INTELLIGENCE database

## When NOT to Use

- General Snowflake questions not related to sales data (use other skills)
- Agent lifecycle management (create, edit, delete agents) — use the bundled `$cortex-agent` skill
- Questions about non-sales tables or databases
- Generic SQL help unrelated to the SALES_INTELLIGENCE schema

---

## Workflow Routing

```
User asks a sales question
  |
  ├─ Structured metrics (counts, revenue, win rates, rankings)
  │    → cortex analyst query ... --model=<semantic_model>
  │
  ├─ Conversations (transcripts, sentiment, objections)
  │    → snowflake_sql_execute against SALES_CONVERSATIONS
  │    → or bundled $cortex-agent CHAT for semantic search
  │
  ├─ Combined (metrics + conversation context)
  │    → Analyst first, then conversations, then summarize
  │
  └─ Workflow template requested
       ├─ "rep performance review"  → Workflow 1
       ├─ "pipeline health check"   → Workflow 2
       └─ "quarterly sales summary" → Workflow 3
```

---

## Agent & Data Reference

### Cortex Agent

| Property | Value |
|---|---|
| Agent | `SNOWFLAKE_INTELLIGENCE.AGENTS.SALES_INTELLIGENCE_AGENT` |
| Model | `claude-sonnet-4-5` |
| Role | `SALES_INTELLIGENCE_RL` |
| Warehouse | `SALES_INTELLIGENCE_WH` |

The agent has two built-in tools:

1. **Sales_metrics_model** (Cortex Analyst — text-to-SQL)
   - Semantic model: `@SALES_INTELLIGENCE.DATA.DATA/sales_metrics_model.yaml`
   - Answers structured questions about deals, revenue, win rates, pipeline
2. **Sales_conversation_search** (Cortex Search)
   - Search service: `SALES_INTELLIGENCE.DATA.SALES_CONVERSATION_SEARCH`
   - Searches sales conversation transcripts for customer sentiment, objections, discussion topics

### Data Sources

| Table | Purpose |
|---|---|
| `SALES_INTELLIGENCE.DATA.SALES_METRICS` | Deal-level sales data (metrics, pipeline, win rates). Schema documented in the semantic model YAML above. |
| `SALES_INTELLIGENCE.DATA.SALES_CONVERSATIONS` | Sales call/meeting transcripts. Use `DESCRIBE TABLE` at runtime for schema. |

To discover column names, types, and descriptions at runtime:
- For SALES_METRICS: the semantic model YAML is the source of truth (includes descriptions, sample values, synonyms)
- For SALES_CONVERSATIONS: run `DESCRIBE TABLE SALES_INTELLIGENCE.DATA.SALES_CONVERSATIONS`

**Data range caveat:** All data currently covers January-February 2024. When users ask about "last quarter" or "this quarter" relative to the current date, inform them of the available date range and offer to query all available data instead.

---

## Instructions

When the user asks a sales-related question, determine which tool to use based on the question type:

### Structured metrics (deal counts, revenue, win rates, pipeline values)

Use `cortex analyst query` with the semantic model:

```bash
cortex analyst query "<question>" --model="@SALES_INTELLIGENCE.DATA.DATA/sales_metrics_model.yaml"
```

If the Analyst returns SQL, you can also run it directly via `snowflake_sql_execute` to get the raw data, or modify the SQL for follow-up analysis.

### Conversation and transcript search (what was discussed, sentiment, objections)

Use the bundled `$cortex-agent` skill with the CHAT intent to send a question to the agent. The agent will use its Cortex Search tool to search transcripts.

Alternatively, query the conversations table directly:

```sql
SELECT CONVERSATION_ID, CUSTOMER_NAME, SALES_REP, TRANSCRIPT_TEXT
FROM SALES_INTELLIGENCE.DATA.SALES_CONVERSATIONS
WHERE CUSTOMER_NAME = '<name>'
ORDER BY CONVERSATION_DATE DESC;
```

### Combined analysis (metrics + conversation context)

1. Get the structured data via `cortex analyst query` or direct SQL
2. Search conversations for relevant context
3. Combine and summarize

### Validation: Empty Results

If any query returns 0 rows:
- Check whether the question uses a date range outside Jan-Feb 2024
- Check whether the filter values match valid dimension values (refer to `sample_values` in the semantic model YAML, or run `SELECT DISTINCT <column> FROM <table>` to verify)
- Inform the user of the issue and suggest an adjusted query before proceeding

---

## Sample Questions

**Metrics**
- "What were the top 5 deals by value?"
- "What is the total revenue by sales rep?"
- "What is the win rate by product line?"
- "Show me all pending deals sorted by deal value"
- "How does Mike Chen's pipeline compare to Rachel Torres's?"

**Conversations**
- "What were the key discussion points with TechCorp Global?"
- "Did any customers express concerns about pricing?"
- "Summarize Sarah Johnson's recent sales conversations"

**Combined**
- "Which pending deals have the highest value, and what was discussed in the latest conversations?"
- "What is James Wilson's win rate, and what patterns do you see in his lost deals?"

---

## Workflow Templates

### 1. Rep Performance Review

Assess a specific sales rep's performance with both quantitative metrics and qualitative conversation analysis.

**Step 1: Get metrics**

Query win rate, total revenue, deal count, and average deal value for the rep:
```bash
cortex analyst query "What is <rep_name>'s win rate, total revenue, number of deals, and average deal value?" --model="@SALES_INTELLIGENCE.DATA.DATA/sales_metrics_model.yaml"
```

If 0 rows returned, verify `<rep_name>` matches a valid sales rep (check `sample_values` for SALES_REP in the semantic model, or run `SELECT DISTINCT SALES_REP FROM SALES_INTELLIGENCE.DATA.SALES_METRICS`). Inform the user and stop if no match.

**Step 2: Get deal breakdown**

Query deals by stage and product line:
```sql
SELECT SALES_STAGE, PRODUCT_LINE, COUNT(*) AS deal_count, SUM(DEAL_VALUE) AS total_value
FROM SALES_INTELLIGENCE.DATA.SALES_METRICS
WHERE SALES_REP = '<rep_name>'
GROUP BY SALES_STAGE, PRODUCT_LINE;
```

**Step 3: Get conversation highlights**

Search for the rep's recent conversations:
```sql
SELECT CUSTOMER_NAME, DEAL_STAGE, CONVERSATION_DATE, TRANSCRIPT_TEXT
FROM SALES_INTELLIGENCE.DATA.SALES_CONVERSATIONS
WHERE SALES_REP = '<rep_name>'
ORDER BY CONVERSATION_DATE DESC;
```

**Step 4: Present intermediate results**

Present the metrics and conversation data to the user before generating the summary.

> **STOP**: Show the user the metrics (Step 1-2) and conversation highlights (Step 3). Ask: "Here are the raw results. Shall I proceed with generating the performance summary?"

**Step 5: Summarize**

Combine the metrics and conversation insights into a performance summary with:
- Overall metrics (win rate, revenue, deal count)
- Deal breakdown by stage and product
- Strengths (based on wins and positive conversation signals)
- Areas for improvement (based on losses and objections raised)
- Recommendations

---

### 2. Pipeline Health Check

Evaluate the current sales pipeline for risk and opportunity.

**Step 1: Get pipeline overview**

Query all pending deals:
```bash
cortex analyst query "Show all pending deals with their customer name, deal value, sales rep, and product line, sorted by deal value descending" --model="@SALES_INTELLIGENCE.DATA.DATA/sales_metrics_model.yaml"
```

If 0 rows returned, inform the user there are no pending deals and stop.

**Step 2: Analyze risk signals**

For each high-value pending deal, search conversations for objections, delays, or competitor mentions:
```sql
SELECT c.CUSTOMER_NAME, c.DEAL_STAGE, c.CONVERSATION_DATE, c.TRANSCRIPT_TEXT
FROM SALES_INTELLIGENCE.DATA.SALES_CONVERSATIONS c
JOIN SALES_INTELLIGENCE.DATA.SALES_METRICS m
  ON c.CUSTOMER_NAME = m.CUSTOMER_NAME
WHERE m.SALES_STAGE = 'Pending'
ORDER BY m.DEAL_VALUE DESC;
```

**Step 3: Present intermediate results**

> **STOP**: Show the user the pending deals and associated conversations. Ask: "Here are the pending deals and conversation signals. Shall I proceed with the risk assessment?"

**Step 4: Summarize**

Produce a pipeline health report:
- Total pipeline value
- Deals flagged as at-risk (based on negative conversation signals: objections, competitor mentions, delays)
- Deals likely to close (based on positive signals)
- Recommended actions per deal

---

### 3. Quarterly Sales Summary

Generate an executive summary of sales performance for a given time period.

**Step 1: Confirm date range**

> **STOP**: Ask the user for the date range. Note: available data covers January-February 2024. If the user requests a range outside this, inform them and offer to query all available data instead.

**Step 2: Get closed deal metrics**

Query total revenue, deal count, and average deal value for the period:
```bash
cortex analyst query "What is the total revenue, number of closed deals, and average deal value for deals closed between <start_date> and <end_date>?" --model="@SALES_INTELLIGENCE.DATA.DATA/sales_metrics_model.yaml"
```

If 0 rows returned, inform the user no closed deals exist in the requested range. Offer to widen the range or query all data.

**Step 3: Break down by dimension**

Query by product line and by rep:
```sql
SELECT PRODUCT_LINE, COUNT(*) AS deals, SUM(DEAL_VALUE) AS revenue
FROM SALES_INTELLIGENCE.DATA.SALES_METRICS
WHERE SALES_STAGE = 'Closed' AND CLOSE_DATE BETWEEN '<start_date>' AND '<end_date>'
GROUP BY PRODUCT_LINE
ORDER BY revenue DESC;
```
```sql
SELECT SALES_REP, COUNT(*) AS deals, SUM(DEAL_VALUE) AS revenue
FROM SALES_INTELLIGENCE.DATA.SALES_METRICS
WHERE SALES_STAGE = 'Closed' AND CLOSE_DATE BETWEEN '<start_date>' AND '<end_date>'
GROUP BY SALES_REP
ORDER BY revenue DESC;
```

**Step 4: Get conversation highlights for top deals**

Pull transcripts for the highest-value closed deals:
```sql
SELECT m.DEAL_ID, m.CUSTOMER_NAME, m.DEAL_VALUE, c.TRANSCRIPT_TEXT
FROM SALES_INTELLIGENCE.DATA.SALES_METRICS m
LEFT JOIN SALES_INTELLIGENCE.DATA.SALES_CONVERSATIONS c
  ON m.CUSTOMER_NAME = c.CUSTOMER_NAME
WHERE m.SALES_STAGE = 'Closed' AND m.CLOSE_DATE BETWEEN '<start_date>' AND '<end_date>'
ORDER BY m.DEAL_VALUE DESC
LIMIT 5;
```

**Step 5: Present intermediate results**

> **STOP**: Show the user the metrics breakdown and top deal conversations. Ask: "Here are the results. Shall I compile the executive summary?"

**Step 6: Summarize**

Compile an executive summary:
- Total revenue and deal count for the period
- Top-performing reps (by revenue and win count)
- Product line breakdown
- Key customer wins with conversation highlights
- Notable trends or concerns

---

## Stopping Points

- **Before workflow execution**: If the user requests a workflow template, confirm which workflow and any required parameters (rep name, date range) before starting.
- **After intermediate results** (Steps marked STOP in each workflow): Present raw data and ask the user to confirm before generating the summary. This prevents cascading errors if early queries return unexpected results.
- **On empty results**: Do not proceed to the next step. Inform the user and suggest adjustments.

**Resume rule:** Upon user approval (e.g., "yes", "proceed", "looks good"), continue directly to the next step without re-asking.

---

## Output

Each workflow produces a structured text summary with:
- Data tables showing query results
- Analysis narrative combining metrics and conversation insights
- Actionable recommendations where applicable

For ad-hoc questions (not workflows), output the query results directly with brief interpretation.

---

## Notes

- The semantic model YAML is stored on a Snowflake stage at `@SALES_INTELLIGENCE.DATA.DATA/sales_metrics_model.yaml`. The local copy is at `snowflake-cortex-agent-evaluations-sample/sfguide-getting-started-with-cortex-agents/sales_metrics_model.yaml`.
- This skill uses only built-in Cortex Code tools (`cortex analyst query`, `snowflake_sql_execute`, and the bundled `$cortex-agent` skill). No custom scripts or manual token management is needed.
