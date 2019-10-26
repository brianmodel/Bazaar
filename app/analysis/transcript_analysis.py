
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
module_url = "https://tfhub.dev/google/universal-sentence-encoder/2" #@param ["https://tfhub.dev/google/universal-sentence-encoder/2", "https://tfhub.dev/google/universal-sentence-encoder-large/3"]

# Import the Universal Sentence Encoder's TF Hub module
embed = hub.Module(module_url)

# Compute a representation for each message, showing various lengths supported.
s1 = "Hey!, how much for the thingy"
s2 = "That's way too much, I can only do 50"
s3 = "Alright then, I'll do 55, but I'm not happy about it"

messages = [s1, s2, s3]

# Reduce logging output.
tf.logging.set_verbosity(tf.logging.ERROR)

with tf.Session() as session:
    session.run([tf.global_variables_initializer(), tf.tables_initializer()])
    message_embeddings = session.run(embed(messages))
    print(message_embeddings)

    haggle_messages = ["That's way too much, I can only do 50", 
                        "I'll give you 20 for it", 
                        "I can only do 26",
                        "Would 34 be enough for the bike?",
                        "I can't go that high",
                        "Come on man, cut me some slack",
                        "There's no way it's worth that much"]


  # for i, message_embedding in enumerate(np.array(message_embeddings).tolist()):
  #   print("Message: {}".format(messages[i]))
  #   print("Embedding size: {}".format(len(message_embedding)))
  #   message_embedding_snippet = ", ".join(
  #       (str(x) for x in message_embedding[:3]))
  #   print("Embedding: [{}, ...]\n".format(message_embedding_snippet))