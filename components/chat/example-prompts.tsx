import { ReaderIcon } from "@radix-ui/react-icons";

const people = [
  {
    name: "Summarize the following document:",
    role: "Summarization",
  },
  {
    name: "Find some interesting facts about the following:",
    role: "Question Answering",
  },
  {
    name: "Explain a little more about the following:",
    role: "Explanation",
  },
  {
    name: "Translate the following document:",
    role: "Language Translation",
  },
];

export default function ExamplePrompts() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {people.map((person) => (
        <div
          key={person.name}
          className="relative flex items-center space-x-3 rounded-lg border bg-background px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-primary transition-all duration-200"
        >
          <div className="flex-shrink-0">
            <ReaderIcon />
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium">{person.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {person.role}
              </p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
