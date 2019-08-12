import React from 'react';

let Writing = (props) => {
  let classes = props.writing.priority ?
      "btn-lg btn btn-danger mr-2" : "btn btn-lg btn-outline-danger mr-2";
  let kanjiText = props.writing.kanji;

  if (props.writing.frequencyRating < 99999) {
    kanjiText = `${kanjiText} (${props.writing.frequencyRating})`
  }

  return (
    <span
        className={ classes }
        data-toggle="modal"
        data-target="#kanji-stroke-order-modal"
        data-kanji={ props.writing.kanji }
        key={ props.writing.kanji }
        // FIXME: this is shitty
        // onClick={(event) => {
        //   document.getElementById('kanji-stroke-order').innerHTML = event.target.dataset.kanji;
        // }}
        >
      {kanjiText}
    </span>
  );
}

let Reading = (props) => {
  let classes = props.reading.priority ?
      "btn btn-lg btn-danger mr-2" : "btn btn-lg btn-outline-danger mr-2";

  return (
    <span className={ classes } key={ props.reading.kana }>
      {props.reading.kana}
    </span>
  );
};

let Sense = (props) => {
  let PartOfSpeech = (props) => {
    return (
      <p className="part-of-speech small">
        { props.partOfSpeech }
      </p>
    );
  };

  let Translation = (props) => {
    const subFields = [
      "info",
      "misc",
      "fields",
      "similar",
      "antonyms",
      "loanwords",
      "dialects",
      "associatedReadings",
      "associatedWritings"
    ];

    let SubField = (props) => {
      return !props.data ? null : (
        <div>
          <p className="badge badge-danger">
            { props.name }: { props.data.join(', ') }
          </p>
        </div>
      );
    };

    let Glossary = (props) => {
      return (
        <li className="list-group-item glossary">
          { props.glossary }

          {/* {subFields.map(function (fieldName) {
            return <SubField data={props.translation[fieldName]} name={fieldName} key={fieldName} />
          })} */}
        </li>
      );
    };

    let glossaries = props.translation.glossaries.map(function (glossary) {
      return <Glossary glossary={ glossary } key={ glossary } />;
    });

    return (
      <ul className="list-group list-group-flush">
        { glossaries }
      </ul>
    );
  };

  let partsOfSpeech = props.sense.partsOfSpeech.map(function (partOfSpeech) {
    return <PartOfSpeech partOfSpeech={ partOfSpeech } />;
  });

  let senses = props.sense.translations.map(function (translation) {
    return <Translation translation={ translation } />;
  });

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-4">
          { partsOfSpeech }
        </div>

        <div className="col-8">
          <div className="card">
            { senses }
          </div>
        </div>
      </div>
    </li>
  );
};

let Entry = (props) => {
  let writings = props.entry.writings.map(function (writing) {
    return <Writing writing={ writing } key={ writing.kanji } />;
  });

  let readings = props.entry.readings.map(function (reading) {
    return <Reading reading={ reading } key={ reading.kana } />;
  });

  let senses = props.entry.senses.map(function (sense) {
    return <Sense sense={ sense } />
  });

  return (
    <div className="card mb-3" id={ props.entry._id }>
      <div className="card-header">
          { writings }
      </div>

      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          { readings }
        </li>

        { senses }
      </ul>
    </div>
  );
};

export default Entry;
