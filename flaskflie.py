from flask import Flask, request, jsonify
import json

app = Flask(__name__)
data = [
    {
        "Crafting Item": "Fertilizer Spreader",

        "Wiring and electrical components": 20,
        "Wooden handle": None,


        "Hopper for fertilizer": 1,

    },
    {
        "Crafting Item": "Hoe",

        "Wiring and electrical components": 10,
        "Wooden handle": 1,

        "Hopper for fertilizer": 1,
        "Handle or control mechanism": 1,
        "Tilling blades or tines": 1,
    },
    {
        "Crafting Item": "Sprayer",
        "Wiring and electrical components": 30,
        "Wooden handle": None,

        "Hopper for fertilizer": 1,

        "Spray nozzles": 3,

        "Hose": 1,
        "Control valves": 1,
    },
    {
        "Crafting Item": "Tiller",
        "Wiring and electrical components": 40,
        "Wooden handle": None,
        "Wheels or tracks": 2,
        "Tilling blades or tines": 1,
    }
]
user_input = {
    "Wiring and electrical components": 38,
    "Wooden handle": 5,
    "Hopper for fertilizer": 5,  # Assuming the user has an extra hopper
    "Handle or control mechanism": 5,
    "Tilling blades or tines": 5,
    "Spray nozzles": 5,  # Assuming the user has two spray nozzles
    "Hose": 5,
    "Control valves": 5,
    "Wheels or tracks": 5,
}

@app.route('/getTools', methods=['GET'])
def check():
    print(request.get_json());
    user_input = request.get_json();
    tool_quantities = {item['Crafting Item']: float('inf') for item in data}

    # Iterate through each crafting item
    for item in data:
        # Check if all the components required for this crafting item are available
        components_available = True
        for component, quantity in item.items():
            if component != 'Crafting Item' and quantity is not None and quantity > 0:
                # Check if the quantity of this component is available
                if component in user_input:
                    max_quantity = user_input[component] // quantity
                    tool_quantities[item['Crafting Item']] = min(tool_quantities[item['Crafting Item']], max_quantity)

    # Initialize a list to store tools that can be made
    available_tools = []

    # Iterate through each crafting item
    for item in data:
        # Check if the maximum quantity of this tool is greater than zero
        if tool_quantities[item['Crafting Item']] > 0:
            available_tools.append((item['Crafting Item'], tool_quantities[item['Crafting Item']]))

    # Print the tools that can be made
    tools = []

    print('\nTools that can be made:')
    for tool, quantity in available_tools:
        tools.append([tool, quantity])
        # print(f"{tool}: {quantity}")

    print(tools)
    json_object = json.dumps(tools)
    print(json_object)


    return json_object


@app.route('/newreq/<requested_tool>', methods=['GET'])
def check_components(requested_tool):
    # Check if the requested tool is in the data
    found = False
    for item in data:
        if item["Crafting Item"] == requested_tool:
            found = True
            break
    if not found:
        return jsonify({"error": "Requested tool not found"}), 404

    # Check for needed components
    needed_items = {}
    for component, quantity in item.items():
        if component != "Crafting Item" and quantity is not None:
            if component not in user_input or user_input[component] < quantity:
                needed_items[component] = quantity - \
                    user_input.get(component, 0)

    if not needed_items:
        return jsonify({"message": "You have all the required items to make the requested tool."})
    else:
        return jsonify({"message": "You are missing the following items to make the requested tool.", "needed_items": needed_items})


if __name__ == '__main__':
    app.run(port=443 , debug = True)