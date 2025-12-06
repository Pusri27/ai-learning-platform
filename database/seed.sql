-- Insert Courses
INSERT INTO courses (id, title, description, level, thumbnail) VALUES
('c0000000-0000-0000-0000-000000000001', 'AI Basics', 'Introduction to Artificial Intelligence concepts, history, and future.', 'Beginner', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000002', 'Python for AI', 'Learn Python programming specifically for Machine Learning applications.', 'Intermediate', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000003', 'Math for Machine Learning', 'Linear Algebra, Calculus, and Probability needed for ML.', 'Advanced', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000004', 'Data Science Fundamentals', 'Learn to analyze data, create visualizations, and make data-driven decisions.', 'Beginner', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000005', 'Web Development for AI', 'Build web interfaces for your AI models using React and Next.js.', 'Intermediate', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000006', 'Natural Language Processing', 'Understand how computers process and analyze natural language data.', 'Advanced', 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000007', 'Computer Vision Basics', 'Learn how computers "see" and interpret images and videos.', 'Intermediate', 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000008', 'AI Ethics and Safety', 'Explore the ethical implications of AI and how to build safe systems.', 'Beginner', 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80'),
('c0000000-0000-0000-0000-000000000009', 'Robotics and AI', 'Introduction to autonomous agents and robotic control systems.', 'Advanced', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80');

-- Insert Lessons for AI Basics
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000001', 'What is AI?', 'Artificial Intelligence (AI) is the simulation of human intelligence processes by machines.', 1),
('c0000000-0000-0000-0000-000000000001', 'Types of AI', 'AI can be categorized as either weak or strong. Weak AI is designed for a particular task.', 2),
('c0000000-0000-0000-0000-000000000001', 'Machine Learning vs Deep Learning', 'Machine learning is a subset of AI. Deep learning is a subset of machine learning.', 3),
('c0000000-0000-0000-0000-000000000001', 'History of AI', 'From Turing Test to modern LLMs, explore the timeline of AI development.', 4),
('c0000000-0000-0000-0000-000000000001', 'AI in Daily Life', 'How AI impacts our daily lives through recommendations, assistants, and automation.', 5),
('c0000000-0000-0000-0000-000000000001', 'The Future of AI', 'Predictions and trends for the next decade in artificial intelligence.', 6),
('c0000000-0000-0000-0000-000000000001', 'Key AI Terminology', 'Understanding terms like Neural Networks, NLP, Computer Vision, and Reinforcement Learning.', 7),
('c0000000-0000-0000-0000-000000000001', 'AI Tools and Frameworks', 'Overview of popular tools like TensorFlow, PyTorch, and Scikit-learn.', 8),
('c0000000-0000-0000-0000-000000000001', 'Careers in AI', 'Exploring different roles in the AI industry: Data Scientist, ML Engineer, AI Researcher.', 9),
('c0000000-0000-0000-0000-000000000001', 'Getting Started with AI', 'Roadmap and resources for beginning your journey in Artificial Intelligence.', 10);

-- Insert Lessons for Python for AI
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000002', 'Python Basics', 'Python is a high-level, interpreted, general-purpose programming language.', 1),
('c0000000-0000-0000-0000-000000000002', 'NumPy Introduction', 'NumPy is a library for the Python programming language, adding support for large arrays.', 2),
('c0000000-0000-0000-0000-000000000002', 'Pandas for Data Analysis', 'Pandas is a software library written for the Python programming language for data manipulation.', 3),
('c0000000-0000-0000-0000-000000000002', 'Matplotlib Visualization', 'Creating static, animated, and interactive visualizations in Python.', 4),
('c0000000-0000-0000-0000-000000000002', 'Scikit-learn Basics', 'Simple and efficient tools for predictive data analysis.', 5),
('c0000000-0000-0000-0000-000000000002', 'Functions and Modules', 'Writing reusable code with functions and organizing it into modules.', 6),
('c0000000-0000-0000-0000-000000000002', 'Object-Oriented Python', 'Classes, objects, inheritance, and polymorphism in Python.', 7),
('c0000000-0000-0000-0000-000000000002', 'File Handling', 'Reading from and writing to files in Python.', 8),
('c0000000-0000-0000-0000-000000000002', 'Error Handling', 'Using try-except blocks to manage exceptions and errors.', 9),
('c0000000-0000-0000-0000-000000000002', 'Virtual Environments', 'Managing dependencies and isolated environments for Python projects.', 10);

-- Insert Lessons for Math for ML
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000003', 'Linear Algebra: Vectors', 'A vector is an object that has both a magnitude and a direction.', 1),
('c0000000-0000-0000-0000-000000000003', 'Calculus: Derivatives', 'The derivative measures the sensitivity to change of the function value.', 2),
('c0000000-0000-0000-0000-000000000003', 'Probability Basics', 'Probability is the branch of mathematics concerning numerical descriptions of likelihood.', 3),
('c0000000-0000-0000-0000-000000000003', 'Matrices and Operations', 'Matrix addition, multiplication, and inversion.', 4),
('c0000000-0000-0000-0000-000000000003', 'Eigenvalues and Eigenvectors', 'Understanding characteristic vectors of a linear transformation.', 5),
('c0000000-0000-0000-0000-000000000003', 'Gradient Descent', 'An optimization algorithm for finding a local minimum of a differentiable function.', 6),
('c0000000-0000-0000-0000-000000000003', 'Statistics Fundamentals', 'Mean, median, mode, variance, and standard deviation.', 7),
('c0000000-0000-0000-0000-000000000003', 'Bayes Theorem', 'Describes the probability of an event, based on prior knowledge of conditions.', 8),
('c0000000-0000-0000-0000-000000000003', 'Information Theory', 'Quantification, storage, and communication of information.', 9),
('c0000000-0000-0000-0000-000000000003', 'Optimization for ML', 'Techniques to minimize loss functions in machine learning models.', 10);

-- Insert Lessons for Data Science
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000004', 'Data Visualization', 'Graphical representation of information and data.', 1),
('c0000000-0000-0000-0000-000000000004', 'Exploratory Data Analysis', 'Analyzing data sets to summarize their main characteristics.', 2),
('c0000000-0000-0000-0000-000000000004', 'Data Cleaning', 'Process of detecting and correcting (or removing) corrupt or inaccurate records.', 3),
('c0000000-0000-0000-0000-000000000004', 'Feature Engineering', 'Using domain knowledge to extract features from raw data.', 4),
('c0000000-0000-0000-0000-000000000004', 'Statistical Inference', 'Drawing conclusions about a population from a sample.', 5),
('c0000000-0000-0000-0000-000000000004', 'Hypothesis Testing', 'Determining if there is enough evidence to infer that a certain condition is true.', 6),
('c0000000-0000-0000-0000-000000000004', 'Data Wrangling', 'Transforming and mapping data from one "raw" data form into another format.', 7),
('c0000000-0000-0000-0000-000000000004', 'Big Data Concepts', 'Introduction to processing large data sets with tools like Spark.', 8),
('c0000000-0000-0000-0000-000000000004', 'Model Evaluation', 'Metrics like accuracy, precision, recall, and F1-score.', 9),
('c0000000-0000-0000-0000-000000000004', 'Data Storytelling', 'Communicating insights from data effectively to stakeholders.', 10);

-- Insert Lessons for Web Dev for AI
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000005', 'React Basics', 'React is a free and open-source front-end JavaScript library.', 1),
('c0000000-0000-0000-0000-000000000005', 'Integrating AI APIs', 'Fetch data from AI models and display it in your web application.', 2),
('c0000000-0000-0000-0000-000000000005', 'Next.js Fundamentals', 'Server-side rendering and static site generation with Next.js.', 3),
('c0000000-0000-0000-0000-000000000005', 'Tailwind CSS Styling', 'Rapidly build modern websites without ever leaving your HTML.', 4),
('c0000000-0000-0000-0000-000000000005', 'State Management', 'Managing application state with Context API and hooks.', 5),
('c0000000-0000-0000-0000-000000000005', 'Building Chat Interfaces', 'Designing and implementing chat UIs for AI assistants.', 6),
('c0000000-0000-0000-0000-000000000005', 'Streaming Responses', 'Handling streaming text responses from LLMs for better UX.', 7),
('c0000000-0000-0000-0000-000000000005', 'Deployment with Vercel', 'Deploying your Next.js AI application to the edge.', 8),
('c0000000-0000-0000-0000-000000000005', 'Authentication', 'Securing your AI app with user authentication.', 9),
('c0000000-0000-0000-0000-000000000005', 'Database Integration', 'Connecting your frontend to Supabase or other databases.', 10);

-- Insert Lessons for NLP
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000006', 'Tokenization', 'Replacing sensitive data with unique identification symbols.', 1),
('c0000000-0000-0000-0000-000000000006', 'Sentiment Analysis', 'Identifying and extracting subjective information from source materials.', 2),
('c0000000-0000-0000-0000-000000000006', 'Named Entity Recognition', 'Locating and classifying named entities mentioned in unstructured text.', 3),
('c0000000-0000-0000-0000-000000000006', 'Word Embeddings', 'Representation of words for text analysis, typically in the form of a real-valued vector.', 4),
('c0000000-0000-0000-0000-000000000006', 'Transformers Architecture', 'The foundation of modern NLP models like BERT and GPT.', 5),
('c0000000-0000-0000-0000-000000000006', 'Text Generation', 'Using language models to generate human-like text.', 6),
('c0000000-0000-0000-0000-000000000006', 'Machine Translation', 'Automated translation of text or speech from one language to another.', 7),
('c0000000-0000-0000-0000-000000000006', 'Question Answering', 'Building systems that automatically answer questions posed by humans.', 8),
('c0000000-0000-0000-0000-000000000006', 'Text Summarization', 'Producing a concise and fluent summary while preserving key information.', 9),
('c0000000-0000-0000-0000-000000000006', 'Fine-tuning LLMs', 'Adapting pre-trained models to specific tasks or domains.', 10);

-- Insert Lessons for Computer Vision
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000007', 'Image Processing', 'Processing digital images through an algorithm.', 1),
('c0000000-0000-0000-0000-000000000007', 'Object Detection', 'Detecting instances of semantic objects of a certain class.', 2),
('c0000000-0000-0000-0000-000000000007', 'Image Segmentation', 'Partitioning an image into multiple segments (sets of pixels).', 3),
('c0000000-0000-0000-0000-000000000007', 'Convolutional Neural Networks', 'Deep learning algorithm which can take in an input image and assign importance to various aspects.', 4),
('c0000000-0000-0000-0000-000000000007', 'Face Recognition', 'Technology capable of matching a human face from a digital image.', 5),
('c0000000-0000-0000-0000-000000000007', 'Video Analysis', 'Analyzing video content to extract meaningful information.', 6),
('c0000000-0000-0000-0000-000000000007', 'Generative Adversarial Networks', 'Generating new images from scratch using GANs.', 7),
('c0000000-0000-0000-0000-000000000007', 'Medical Imaging', 'Using CV for analyzing medical images like X-rays and MRIs.', 8),
('c0000000-0000-0000-0000-000000000007', 'Optical Character Recognition', 'Converting typed, handwritten or printed text into machine-encoded text.', 9),
('c0000000-0000-0000-0000-000000000007', '3D Computer Vision', 'Reconstructing 3D models from 2D images.', 10);

-- Insert Lessons for AI Ethics
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000008', 'Bias in AI', 'Systematic errors in a computer system that create unfair outcomes.', 1),
('c0000000-0000-0000-0000-000000000008', 'AI Safety', 'Preventing accidents, misuse, or other harmful consequences.', 2),
('c0000000-0000-0000-0000-000000000008', 'Explainability (XAI)', 'Methods and techniques in the application of artificial intelligence technology (AI) such that the results of the solution can be understood by human experts.', 3),
('c0000000-0000-0000-0000-000000000008', 'Privacy and Security', 'Protecting user data and ensuring secure AI deployments.', 4),
('c0000000-0000-0000-0000-000000000008', 'AI Governance', 'Legal and ethical frameworks for managing AI development.', 5),
('c0000000-0000-0000-0000-000000000008', 'Deepfakes and Misinformation', 'Understanding the risks of synthetic media and how to detect it.', 6),
('c0000000-0000-0000-0000-000000000008', 'Job Displacement', 'The impact of AI on the workforce and economy.', 7),
('c0000000-0000-0000-0000-000000000008', 'Human-in-the-loop', 'Combining human intelligence with machine intelligence.', 8),
('c0000000-0000-0000-0000-000000000008', 'Environmental Impact', 'The carbon footprint of training large AI models.', 9),
('c0000000-0000-0000-0000-000000000008', 'Future of Work', 'Preparing for a future where humans and AI collaborate.', 10);

-- Insert Lessons for Robotics
INSERT INTO lessons (course_id, title, content, order_index) VALUES
('c0000000-0000-0000-0000-000000000009', 'Robot Kinematics', 'Study of the movement of multi-degree of freedom kinematic chains.', 1),
('c0000000-0000-0000-0000-000000000009', 'Path Planning', 'Finding a sequence of valid configurations that moves the object from source to destination.', 2),
('c0000000-0000-0000-0000-000000000009', 'Sensors and Perception', 'How robots sense their environment using cameras, LiDAR, etc.', 3),
('c0000000-0000-0000-0000-000000000009', 'Control Systems', 'Managing the behavior of devices or systems.', 4),
('c0000000-0000-0000-0000-000000000009', 'Reinforcement Learning in Robotics', 'Training robots to perform tasks through trial and error.', 5),
('c0000000-0000-0000-0000-000000000009', 'Swarm Robotics', 'Coordination of multiple robots as a system.', 6),
('c0000000-0000-0000-0000-000000000009', 'Human-Robot Interaction', 'Study of interactions between humans and robots.', 7),
('c0000000-0000-0000-0000-000000000009', 'Autonomous Vehicles', 'Self-driving cars and drones.', 8),
('c0000000-0000-0000-0000-000000000009', 'Soft Robotics', 'Robots constructed from highly compliant materials.', 9),
('c0000000-0000-0000-0000-000000000009', 'Industrial Automation', 'Use of control systems for handling different processes and machineries.', 10);
