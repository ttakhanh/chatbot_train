# # This files contains your custom actions which can be used to run
# # custom Python code.
# #
# # See this guide on how to implement these action:
# # https://rasa.com/docs/rasa/custom-actions

# from typing import Any, Text, Dict, List

# from rasa_sdk import Action, Tracker
# from rasa_sdk.executor import CollectingDispatcher
# from rasa_sdk.events import SlotSet
# from rasa_sdk.events import UserUtteranceReverted


# # This is a simple example for a custom action which utters "Hello World!"

# # from typing import Any, Text, Dict, List
# #
# # from rasa_sdk import Action, Tracker
# # from rasa_sdk.executor import CollectingDispatcher
# #
# #
# # class ActionHelloWorld(Action):
# #
# #     def name(self) -> Text:
# #         return "action_hello_world"
# #
# #     def run(self, dispatcher: CollectingDispatcher,
# #             tracker: Tracker,
# #             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
# #
# #         dispatcher.utter_message(text="Hello World!")
# #
# #         return []

# # class ActionDefaultFallback(Action):
# #     def name(self) -> Text:
# #         return "action_out_of_scope"
# #
# #     def run(self, dispatcher, tracker, domain):
# #         dispatcher.utter_message(text="I'm not sure I understand what you mean. Could you please rephrase or ask about a SuperWAL service?")
# #         return []
# class ActionOutOfScope(Action):
#     """Executes the fallback action and goes back to the previous state
#     of the dialogue"""

#     def name(self) -> Text:
#         return "action_out_of_scope"

#     def run(self, dispatcher: CollectingDispatcher,
#             tracker: Tracker,
#             domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

#         dispatcher.utter_message(text="❓ Xin lỗi, tôi chưa hiểu ý bạn. Bạn có thể hỏi lại hoặc tham khảo các dịch vụ trong hệ sinh thái SuperWAL.")

#         # Thêm UserUtteranceReverted để phá vỡ vòng lặp
#         # Nó sẽ yêu cầu Rasa bỏ qua tin nhắn cuối cùng của người dùng,
#         # ngăn việc fallback được kích hoạt lại bởi cùng một tin nhắn.
#         return [UserUtteranceReverted()]