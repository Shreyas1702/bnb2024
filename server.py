from flask import Flask, request, jsonify
import joblib
import pandas as pd

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

app = Flask(__name__)

# Load the trained model
model = joblib.load('planting_model.pkl')
df_pt=pd.read_csv('df_pt.csv')
df_hv=pd.read_csv('df_hv.csv')
model1=joblib.load('harvesting_model.pkl')

@app.route('/planting', methods=['GET'])
def predict():
    new_tuple = request.get_json()
    print(new_tuple)

    # new_tuple = (9,5,3,0,0,0,250,0,0,0,0,18.0,0,0,1,0)

    # Convert the tuple into a DataFrame
    # Assuming columns are in the same order as X_encoded columns
    new_df = pd.DataFrame([new_tuple], columns=['Tractor', 'Plow', 'Seeder', 'Harvester', 'Fertilizer Spreader',
       'Sprayer', 'Wheat', 'Corn', 'Rice', 'Potato', 'Tomato', 'Size_Acres',
       'Activity_Fertilizing', 'Activity_Harvesting', 'Activity_Planting',
       'Activity_Watering'])

    # Make prediction
    prediction = model.predict(new_df)
    # Perform prediction using the loaded model
    print(prediction)
    # prompt: get all the tuples from df_pt where time is nearby prediction + or - 0.5 

    import numpy as np

    tolerance = 1.5

    nearby_tuples = df_pt[np.abs(df_pt['Time'] - prediction) <= tolerance]

    # prompt: get all tuples where nearby_tuples['Tractor', 'Plow', 'Seeder']<= new tuple first 3 values where new_tuple = (2,4,3,0,0,0,120,0,0,0,0,8.0,0,0,1,0)

    new_tuple_first_3 = new_tuple[:3]
    print(new_tuple_first_3)
    nearby_tuples_filtered = nearby_tuples[
    (nearby_tuples['Tractor'] <= new_tuple_first_3[0]) &
    (nearby_tuples['Plow'] <= new_tuple_first_3[1]) &
    (nearby_tuples['Seeder'] <= new_tuple_first_3[2])]

        # prompt: get the median values of nearby_tuples Tractor Plow Seeder and for time take mean

    import numpy as np

    # Calculate the median values for Tractor, Plow, and Seeder
    median_tractor = np.median(nearby_tuples_filtered['Tractor'])
    median_plow = np.median(nearby_tuples_filtered['Plow'])
    median_seeder = np.median(nearby_tuples_filtered['Seeder'])

    # Calculate the mean value for Time
    mean_time = np.mean(nearby_tuples_filtered['Time'])

    # Print the results
    print("Median Tractor:", median_tractor)
    print("Median Plow:", median_plow)
    print("Median Seeder:", median_seeder)
    print("Mean Time:", mean_time)




    # Return prediction as JSON response
    return [median_tractor,median_plow,median_seeder,mean_time]

@app.route('/harvesting', methods=['GET'])
def give():
        new_tuple = request.get_json()
        print(new_tuple)

        # new_tuple = (0,0,0,5,0,0,0,220,0,0,0,6.0,0,1,0,0)

        # Convert the tuple into a DataFrame
        # Assuming columns are in the same order as X_encoded columns
        new_df = pd.DataFrame([new_tuple], columns=['Tractor', 'Plow', 'Seeder', 'Harvester', 'Fertilizer Spreader',
       'Sprayer', 'Wheat', 'Corn', 'Rice', 'Potato', 'Tomato', 'Size_Acres',
       'Activity_Fertilizing', 'Activity_Harvesting', 'Activity_Planting',
       'Activity_Watering'])

        # Make prediction
        prediction = model1.predict(new_df)

        print("Predicted Time:", prediction)

        
        import numpy as np

        # Find indices of rows where time is within 0.5 of the prediction
        indices = np.where(np.abs(df_hv['Time'] - prediction) <= 0.75)[0]

        # Extract the tuples at those indices
        nearby_tuples = df_hv.iloc[indices]

        # Print the nearby tuples
        nearby_tuples

        # prompt: from nearby tuple get the tuples where df['Harvester']<=2 and from that predict the median value of harvester and time

        nearby_tuples_filtered = nearby_tuples[nearby_tuples['Harvester'] <= new_tuple[3]]
        harvester_values = nearby_tuples_filtered['Harvester'].values
        time_values = nearby_tuples_filtered['Time'].values

        median_harvester = np.median(harvester_values)
        mean_time = np.mean(time_values)

        print("Median Harvester:", median_harvester)
        print("Median Time:", mean_time)

        return[median_harvester,mean_time]




if __name__ == '__main__':
    app.run(debug=True)
