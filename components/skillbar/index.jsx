import { useState } from "react";
import Select from "react-select";

const options = [
  { value: "agile", label: "Agile" },
  { value: "ai-ml", label: "AI/ML" },
  { value: "angular", label: "Angular" },
  { value: "aws", label: "AWS" },
  { value: "azure", label: "Azure" },
  { value: "bash", label: "Bash" },
  { value: "big-data", label: "Big Data" },
  { value: "c-sharp", label: "C#" },
  { value: "c-plus-plus", label: "C++" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "css", label: "CSS" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "data-science", label: "Data Science" },
  { value: "docker", label: "Docker" },
  { value: "django", label: "Django" },
  { value: "flutter", label: "Flutter" },
  { value: "git", label: "Git" },
  { value: "graphql", label: "GraphQL" },
  { value: "hadoop", label: "Hadoop" },
  { value: "html", label: "HTML" },
  { value: "ios", label: "iOS" },
  { value: "java", label: "Java" },
  { value: "javascript", label: "JavaScript" },
  { value: "jenkins", label: "Jenkins" },
  { value: "jira", label: "JIRA" },
  { value: "kotlin", label: "Kotlin" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "linux", label: "Linux" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "mongo-db", label: "MongoDB" },
  { value: "mysql", label: "MySQL" },
  { value: "node-js", label: "Node.js" },
  { value: "php", label: "PHP" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "power-bi", label: "Power BI" },
  { value: "python", label: "Python" },
  { value: "r", label: "R" },
  { value: "react", label: "React" },
  { value: "redux", label: "Redux" },
  { value: "rest-api", label: "REST API" },
  { value: "ruby", label: "Ruby" },
  { value: "salesforce", label: "Salesforce" },
  { value: "scala", label: "Scala" },
  { value: "scrum", label: "Scrum" },
  { value: "spring-boot", label: "Spring Boot" },
  { value: "sql", label: "SQL" },
  { value: "swift", label: "Swift" },
  { value: "tensorflow", label: "TensorFlow" },
  { value: "typescript", label: "TypeScript" },
  { value: "vue-js", label: "Vue.js" },
  { value: "web-development", label: "Web Development" },
];

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'white',
    borderColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'transparent',
    },
    padding: '0.25rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  }),
  option: (base, { isFocused, isSelected }) => ({
    ...base,
    backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.9)' : isFocused ? 'rgba(79, 70, 229, 0.5)' : 'white',
    color: isSelected || isFocused ? 'white' : 'black',
    padding: '0.5rem 1rem',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'rgba(79, 70, 229, 1)',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'rgba(79, 70, 229, 1)',
    '&:hover': {
      backgroundColor: 'rgba(79, 70, 229, 0.9)',
      color: 'white',
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgba(107, 114, 128, 1)', // gray-500
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '0.375rem',
    marginTop: '0.25rem',
    fontSize: '0.875rem',
  }),
  menuList: (base) => ({
    ...base,
    padding: '0',
  }),
};

const SkillSelect = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (selectedOption) => {
    setSelectedOptions(selectedOption);
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
     
      <Select
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        isMulti={true}
        styles={customStyles}
        placeholder="Select your skills..."
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
      />
    </div>
  );
};

export default SkillSelect;
