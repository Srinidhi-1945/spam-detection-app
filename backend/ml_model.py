import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

class SpamClassifier:
    def __init__(self):
        self.vectorizer = CountVectorizer()
        self.classifier = MultinomialNB()

    def train(self, data_file='spam_numbers.csv'):
        # Load dataset
        df = pd.read_csv(data_file)

        # Basic cleanup if needed
        if 'message' not in df.columns or 'label' not in df.columns:
            print("CSV must contain 'message' and 'label' columns.")
            return

        # Handle missing values (NaN) in 'message' column
        df['message'] = df['message'].fillna('')  # Replace NaN values with empty strings

        # Convert labels to binary (spam = 1, ham = 0)
        df['label'] = df['label'].map({'spam': 1, 'ham': 0})

        # Ensure there are no NaN or missing labels
        df = df.dropna(subset=['label'])

        # Extract features and labels
        X = self.vectorizer.fit_transform(df['message'])
        y = df['label']

        # Train classifier
        self.classifier.fit(X, y)

        # Save model
        with open('model.pkl', 'wb') as f:
            pickle.dump((self.vectorizer, self.classifier), f)

        print("Model trained and saved to model.pkl")

    def predict(self, text):
        # Ensure the model is loaded first
        if not hasattr(self, 'vectorizer') or not hasattr(self, 'classifier'):
            with open('model.pkl', 'rb') as f:
                self.vectorizer, self.classifier = pickle.load(f)

        # Transform input text into features
        vector = self.vectorizer.transform([text])

        # Predict if it's spam or not
        prediction = self.classifier.predict(vector)
        return 'Spam' if prediction[0] == 1 else 'Not Spam'

# Run training when this file is executed directly
if __name__ == '__main__':
    classifier = SpamClassifier()
    classifier.train()
