import { Fragment } from "react";

// Matches a trailing "Label: 01 / 02 / 03" tail — a colon-terminated label
// followed by nothing but digits/spaces/slashes/+/-/(). Only the numeric
// tail gets isolated; the label stays in normal (possibly RTL) flow.
const LABELLED_NUMBERS = /^(.*?:\s*)([\d\s/+()-]+)$/;

/**
 * Renders a multi-line address (one line per `\n`) safely inside RTL text.
 * A line with no digits renders as-is — Arabic text needs no isolation. A
 * line that's a label followed by one or more phone numbers ("Tel: 01… /
 * 02…") gets its numeric tail wrapped in dir="ltr": without that, the
 * browser's bidi algorithm treats consecutive "/"-separated number groups
 * as one reorderable unit and can visually flip their order within RTL
 * ambient text, even though each individual number's own digits stay
 * correctly ordered (the same bidi issue HeroContactPanel's phone number
 * already isolates the same way).
 */
export function AddressBlock({ value, className }: { value: string; className?: string }) {
  const lines = value.split("\n");
  return (
    <p className={className}>
      {lines.map((line, i) => {
        const match = line.match(LABELLED_NUMBERS);
        return (
          <Fragment key={i}>
            {i > 0 ? <br /> : null}
            {match ? (
              <>
                {match[1]}
                <span dir="ltr" className="inline-block">
                  {match[2].trim()}
                </span>
              </>
            ) : (
              line
            )}
          </Fragment>
        );
      })}
    </p>
  );
}
