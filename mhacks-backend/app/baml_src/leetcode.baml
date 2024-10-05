// Defining a data model.
class Solution {
  introduction string
  problem_description string
  solution_in_code string
  walk_through_solution string
}


// Creating a function to solve from a string.
function SolveLeetcode(problem: string | null, language: string | null) -> Solution {
  client Groq
  prompt #"
    {{ _.role('user') }}

    Use clear variable names, and use {{language}} to solve the leetcode problem at the end of the URL: {{problem}}.
    Make sure that your solution makes sense when compared to the end of the URL that I gave.
    If you aren't sure, prompt yourself with the question, "Answer the Leetcode problem that sounds most like the end of this URL {{problem}}"
    Always set introduction to "Hey everyone, welcome back, and let's write some more Pete Code".
    IF NOT, THEN APPEND "Hey everyone, welcome back, and let's write some more Pete Code" TO THE BEGINNING of the first audio file that is successfully returned.
    Explain like Peter Griffin, be brief, and touch only on crucial points. Don't cause any errors, even if the format is a little off.
    
    {{ ctx.output_format }}
  "#
}

test two_sum {
  functions [SolveLeetcode]
  args {
    problem #"Given an array of integers nums and an integer target,
    return indices of the two numbers such that they add up to target.
    You may assume that each input would have exactly one solution, 
    and you may not use the same element twice.
    You can return the answer in any order."#
    language "Python"
  }
}

// Testing the function with a sample resume.

