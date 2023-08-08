import spacy
from spacy.util import minibatch, compounding
from spacy.training import Example
import random

# Create a blank English model
nlp = spacy.load("en_core_web_sm")

TRAIN_DATA = [('Add meeting with the boss from 4 5 pm on Saturday',
  {'entities': [(4, 25, 'title'),
    (31, 32, 'startTime'),
    (33, 37, 'endTime'),
    (41, 49, 'date')]}),
 ('Insert dentist appointment from 1 2 pm on March 5th',
  {'entities': [(7, 26, 'title'),
    (32, 33, 'startTime'),
    (34, 38, 'endTime'),
    (42, 51, 'date')]})
 ]

#spacy.training.offsets_to_biluo_tags(nlp.make_doc(text), entities)
"""
for token in nlp.make_doc("Insert workshop at 4 pm on Tuesday"):
    print(token)
print("\n\n\n\n")
print(spacy.training.offsets_to_biluo_tags(nlp.make_doc("Join the webinar on the 10th of September at 2 pm"), [(5, 19, 'title'), (42, 49, 'startTime'), (20, 41, 'date')]))
print("\n\n\n\n")
"""

# Add labels to the NER pipe
ner = nlp.get_pipe("ner")
for _, annotations in TRAIN_DATA:
    for ent in annotations.get("entities"):
        ner.add_label(ent[2])

# Convert TRAIN_DATA to a list of Example objects
examples = []
for text, annotations in TRAIN_DATA:
    doc = nlp.make_doc(text)
    example = Example.from_dict(doc, annotations)
    examples.append(example)


# Train the model
optimizer = nlp.resume_training()
for itn in range(20):  # Number of epochs; adjust as needed
    random.shuffle(examples)
    losses = {}
    batches = minibatch(examples, size=compounding(4.0, 32.0, 1.001))
    for batch in batches:
        nlp.update(
            batch,
            drop=0.5,  # Dropout rate; adjust as needed
            losses=losses,
        )
    print(f"Losses at iteration {itn} - {losses}")

doc = nlp("Add meeting with the boss at 5:00-6:00 pm on Tuesday")
print(doc.ents)
for ent in doc.ents:
    print(ent.text, ent.label_)

