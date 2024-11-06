"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code, CheckSquare, Link, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HTMLLevel3Roadmap = () => {
  const [expandedTopics, setExpandedTopics] = useState({});

  const toggleTopic = (topicId) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const htmlLevel3Recommendations = [
    {
      id: 1,
      title: 'HTML5 Semantic Elements',
      theory: `
        HTML5 introduced a set of semantic elements that provide more meaning and structure to web pages. Some of the key semantic elements include:

        - <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>
        - These elements help describe the purpose and content of different parts of a web page.
        - Using semantic elements improves accessibility, SEO, and code maintainability.
      `,
      examples: [
        {
          title: 'Proper Semantic Structure',
          code: `
<body>
  <header>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section>
      <article>
        <h1>Article Title</h1>
        <p>Article content goes here.</p>
      </article>
    </section>
  </main>

  <footer>
    <p>&copy; 2023 My Website</p>
  </footer>
</body>
          `
        }
      ],
      practice: [
        {
          question: 'Identify the semantic elements in the following HTML code and explain their purpose:',
          code: `
<header>
  <nav>
    <ul>
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <article>
      <h1>Blog Post Title</h1>
      <p>Blog post content goes here.</p>
    </article>
  </section>
  <aside>
    <h2>Related Posts</h2>
    <ul>
      <li><a href="#">Post 1</a></li>
      <li><a href="#">Post 2</a></li>
    </ul>
  </aside>
</main>

<footer>
  <p>&copy; 2023 My Blog</p>
</footer>
          `
        }
      ],
      resources: [
        {
          title: 'HTML5 Semantic Elements',
          url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html',
          type: 'documentation'
        },
        {
          title: 'Using HTML Sections and Outlines',
          url: 'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML_sections_and_outlines',
          type: 'tutorial'
        }
      ]
    },
    {
      id: 2,
      title: 'HTML Forms: Advanced Concepts',
      theory: `
        HTML forms provide a way for users to input data and interact with web applications. Beyond the basic form elements, there are several advanced concepts to explore:

        - Client-side Validation: Using the "required", "pattern", and other attributes to validate form input on the client-side.
        - Custom Input Types: Specialized input types like email, url, date, time, number, and range.
        - Form Submission Handling: Leveraging the "submit" event to handle form submissions on the client-side.
        - Accessibility in Forms: Ensuring forms are accessible to users with disabilities.
      `,
      examples: [
        {
          title: 'Form with Client-side Validation',
          code: `
<form>
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="password">Password:</label>
  <input type="password" id="password" name="password" minlength="8" required>

  <button type="submit">Submit</button>
</form>
          `
        },
        {
          title: 'Form with Custom Input Types',
          code: `
<form>
  <label for="date">Date:</label>
  <input type="date" id="date" name="date">

  <label for="time">Time:</label>
  <input type="time" id="time" name="time">

  <label for="number">Number:</label>
  <input type="number" id="number" name="number" min="0" max="100">

  <label for="range">Range:</label>
  <input type="range" id="range" name="range" min="0" max="100">

  <button type="submit">Submit</button>
</form>
          `
        }
      ],
      practice: [
        {
          question: 'Create a form that includes:',
          hints: [
            'At least one required field',
            'At least one field with client-side validation (e.g., email, password)',
            'At least one custom input type (e.g., date, number, range)'
          ],
          solution: `
// Your solution code here
          `
        }
      ],
      resources: [
        {
          title: 'HTML Forms Guide',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms',
          type: 'documentation'
        },
        {
          title: 'HTML5 Form Validation',
          url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation',
          type: 'tutorial'
        }
      ]
    },
    {
      id: 3,
      title: 'HTML Canvas and SVG',
      theory: `
        HTML provides two main ways to create dynamic, scalable graphics on web pages:

        1. HTML <canvas> Element:
           - A drawing surface that can be programmatically manipulated using JavaScript.
           - Useful for creating games, data visualizations, and interactive elements.
           - Requires imperative drawing commands to create graphics.

        2. Scalable Vector Graphics (SVG):
           - An XML-based vector image format that can be directly included in HTML.
           - SVG graphics are resolution-independent and can be styled with CSS.
           - Suitable for creating icons, illustrations, and simple animations.
      `,
      examples: [
        {
          title: 'Basic Canvas Example',
          code: `
<canvas id="myCanvas" width="400" height="400"></canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // Draw a rectangle
  ctx.fillRect(50, 50, 100, 100);

  // Draw a circle
  ctx.beginPath();
  ctx.arc(200, 200, 50, 0, 2 * Math.PI);
  ctx.fill();
</script>
          `
        },
        {
          title: 'Simple SVG Image',
          code: `
<svg width="400" height="400" viewBox="0 0 400 400">
  <rect x="50" y="50" width="100" height="100" fill="#ccc" />
  <circle cx="200" cy="200" r="50" fill="#06c" />
</svg>
          `
        }
      ],
      practice: [
        {
          question: 'Create an SVG image that includes at least three shapes (e.g., rectangle, circle, triangle).',
          hints: [
            'Use the <rect>, <circle>, and <polygon> elements to create the shapes',
            'Experiment with different fill and stroke colors'
          ],
          solution: `
// Your SVG solution code here
          `
        },
        {
          question: 'Use the HTML <canvas> element to draw a simple animation, such as a bouncing ball or a spinning shape.',
          hints: [
            'Use the canvas 2D rendering context to draw the shapes',
            'Implement a loop to update the animation frame-by-frame'
          ],
          solution: `
// Your Canvas animation solution code here
          `
        }
      ],
      resources: [
        {
          title: 'HTML Canvas API',
          url: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
          type: 'documentation'
        },
        {
          title: 'Scalable Vector Graphics (SVG)',
          url: 'https://developer.mozilla.org/en-US/docs/Web/SVG',
          type: 'documentation'
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"> 
          <Book className="w-5 h-5" />
          HTML Level 3 Learning Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {htmlLevel3Recommendations?.map((topic) => (
            <div key={topic.id} className="border-l-2 border-blue-500 pl-4">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-between p-4 hover:bg-gray-100"
                onClick={() => toggleTopic(topic.id)}
              >
                <span className="font-semibold">{topic.title}</span>
                {expandedTopics[topic.id] ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </Button>

              {expandedTopics[topic.id] && (
                <div className="mt-4 px-4">
                  <Tabs defaultValue="theory">
                    <TabsList>
                      <TabsTrigger value="theory" className="flex items-center gap-2">
                        <Book className="w-4 h-4" />
                        Theory
                      </TabsTrigger>
                      <TabsTrigger value="examples" className="flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Examples
                      </TabsTrigger>
                      <TabsTrigger value="practice" className="flex items-center gap-2">
                        <CheckSquare className="w-4 h-4" />
                        Practice
                      </TabsTrigger>
                      <TabsTrigger value="resources" className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Resources
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="theory" className="mt-4">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans">{topic.theory}</pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="examples" className="mt-4 space-y-4">
                      {topic?.examples?.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="font-semibold">{example.title}</h3>
                          <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="practice" className="mt-4 space-y-6">
                      {topic?.practice?.map((exercise, index) => (
                        <div key={index} className="space-y-4">
                          <div className="font-semibold">{exercise.question}</div>
                          <div className="space-y-2">
                            <div className="font-medium">Hints:</div>
                            <ul className="list-disc pl-5">
                              {exercise?.hints?.map((hint, i) => (
                                <li key={i} className="text-sm text-gray-600">
                                  {hint}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <Button variant="outline" onClick={() => alert(exercise.solution)}>
                              Show Solution
                            </Button>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    <TabsContent value="resources" className="mt-4">
                      <div className="grid gap-4">
                        {topic?.resources?.map((resource, index) => (
                          <a
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-50 p-4 rounded-md flex items-center justify-between hover:bg-gray-100"
                          >
                            <div>
                              <div className="font-medium">{resource.title}</div>
                              <div className="text-sm text-gray-500">{resource.type}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          </a>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HTMLLevel3Roadmap;