# This files contains your custom actions which can be used to run
# custom Python code.
#
# See this guide on how to implement these action:
# https://rasa.com/docs/rasa/custom-actions

from typing import Any, Text, Dict, List

from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

# This is a simple example for a custom action which utters "Hello World!"

# from typing import Any, Text, Dict, List
#
# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
#
#
# class ActionHelloWorld(Action):
#
#     def name(self) -> Text:
#         return "action_hello_world"
#
#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
#
#         dispatcher.utter_message(text="Hello World!")
#
#         return []

# class ActionDefaultFallback(Action):
#     def name(self) -> Text:
#         return "action_out_of_scope"
#
#     def run(self, dispatcher, tracker, domain):
#         dispatcher.utter_message(text="I'm not sure I understand what you mean. Could you please rephrase or ask about a SuperWAL service?")
#         return []
class ActionOutOfScope(Action):
    """Executes the fallback action and goes back to the previous state
    of the dialogue"""

    def name(self) -> Text:
        return "action_out_of_scope"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        fallback_count = tracker.get_slot("fallback_count") or 0
        fallback_count += 1

        if fallback_count > 2:
            dispatcher.utter_message("I'm not sure I understand what you mean. Could you please rephrase or ask about a SuperWAL service?")
            return [SlotSet("fallback_count", 0)]
        else:
            dispatcher.utter_message("I'm not sure I understand what you mean. Could you please rephrase or ask about a SuperWAL service?")
            return [SlotSet("fallback_count", fallback_count)]
