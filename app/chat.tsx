import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Role = 'user' | 'assistant';

type Message = {
  id: string;
  role: Role;
  text: string;
};

const PRIVATE_LLM_URL = 'https://your-private-llm-api.example.com/chat';
const PRIVATE_LLM_TOKEN = 'replace-with-your-token';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(PRIVATE_LLM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${PRIVATE_LLM_TOKEN}`,
        },
        body: JSON.stringify({
          message: text,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data?.reply ?? 'No reply received.';

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: assistantText,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-error`,
          role: 'assistant',
          text: 'Could not reach your LLM. Check URL/token and try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                item.role === 'user' ? styles.userBubbleText : styles.assistantBubbleText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Send a message to start.</Text>}
      />

      <View style={[styles.inputRow, { paddingBottom: Math.max(10, insets.bottom) }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message"
          editable={!loading}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <Pressable style={styles.sendButton} onPress={sendMessage} disabled={loading}>
          <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  messagesContent: {
    padding: 16,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: 24,
  },
  bubble: {
    maxWidth: '85%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0f172a',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#e2e8f0',
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userBubbleText: {
    color: '#ffffff',
  },
  assistantBubbleText: {
    color: '#0f172a',
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dbe2ea',
    backgroundColor: '#ffffff',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  sendButton: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
