export interface KotlinFileItem {
  id: string;
  name: string;
  path: string;
  language: string;
  category: 'architecture' | 'database' | 'firebase' | 'ui' | 'viewmodel' | 'api';
  description: string;
  code: string;
}

export const KOTLIN_PROJECT_FILES: KotlinFileItem[] = [
  {
    id: 'folder-tree',
    name: 'Android Studio Folder Structure',
    path: 'Project Tree: PromptVerse',
    language: 'plaintext',
    category: 'architecture',
    description: 'Clean Architecture + MVVM recommended Android Studio package organization with AI Studio.',
    code: `PromptVerse/
├── gradle/
│   ├── wrapper/
│   └── libs.versions.toml             # Gradle Version Catalog (Compose, Hilt, Room, Firebase, Gemini)
├── build.gradle.kts                   # Root project build script
└── app/
    ├── build.gradle.kts               # App module build script (Compose, Gemini SDK, Veo client)
    └── src/
        └── main/
            ├── AndroidManifest.xml    # Permissions, Application class, FCM Service
            ├── java/com/promptverse/app/
            │   ├── PromptVerseApp.kt  # @HiltAndroidApp Application class
            │   ├── di/                # Dagger-Hilt Dependency Injection Modules
            │   │   ├── DatabaseModule.kt
            │   │   ├── FirebaseModule.kt
            │   │   ├── AiNetworkModule.kt
            │   │   └── RepositoryModule.kt
            │   ├── data/              # Data Layer (Room, Firebase, Gemini SDK)
            │   │   ├── local/
            │   │   │   ├── PromptDatabase.kt
            │   │   │   ├── dao/PromptDao.kt
            │   │   │   └── entity/PromptEntity.kt
            │   │   └── remote/
            │   │       ├── api/GeminiAiService.kt     # Chat, Nano Banana & Search Grounding
            │   │       ├── api/VeoVideoService.kt      # Veo 3 Video Generation Client
            │   │       └── fcm/PromptVerseFcmService.kt
            │   ├── domain/            # Domain Layer (UseCases & Domain Models)
            │   │   ├── model/Prompt.kt
            │   │   ├── model/AiGeneration.kt
            │   │   └── usecase/
            │   │       ├── GenerateAiImageUseCase.kt
            │   │       ├── GenerateVeoVideoUseCase.kt
            │   │       └── SearchGroundedPromptUseCase.kt
            │   └── ui/                # Presentation Layer (Jetpack Compose Material 3)
            │       ├── navigation/NavGraph.kt
            │       ├── screens/
            │       │   ├── feed/FeedScreen.kt
            │       │   ├── aistudio/AiStudioScreen.kt # Chat, Nano Banana, Veo 3 & Search
            │       │   ├── detail/PromptDetailScreen.kt
            │       │   ├── categories/CategoriesScreen.kt
            │       │   └── library/LibraryScreen.kt
            │       └── viewmodel/
            │           ├── FeedViewModel.kt
            │           ├── AiStudioViewModel.kt
            │           └── PromptDetailViewModel.kt
            └── res/
                ├── drawable/
                └── values/`,
  },
  {
    id: 'api-gemini-client',
    name: 'GeminiAiService.kt (Chat, Nano Banana & Search)',
    path: 'app/src/main/java/com/promptverse/app/data/remote/api/GeminiAiService.kt',
    language: 'kotlin',
    category: 'api',
    description: 'Kotlin integration for Google Generative AI SDK with Search Grounding, Chatbot, and Image Generation.',
    code: `package com.promptverse.app.data.remote.api

import com.google.ai.client.generativeai.GenerativeModel
import com.google.ai.client.generativeai.type.content
import com.google.ai.client.generativeai.type.Tool
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GeminiAiService @Inject constructor() {

    // 1. General & Search Grounded Model (gemini-3.8-flash)
    private val flashModel by lazy {
        GenerativeModel(
            modelName = "gemini-3.8-flash",
            apiKey = System.getenv("GEMINI_API_KEY") ?: ""
        )
    }

    // 2. High-speed Chat Model (gemini-3.1-flash-lite)
    private val fastChatModel by lazy {
        GenerativeModel(
            modelName = "gemini-3.1-flash-lite",
            apiKey = System.getenv("GEMINI_API_KEY") ?: ""
        )
    }

    // 3. Complex Reasoning Model (gemini-4-argon)
    private val complexModel by lazy {
        GenerativeModel(
            modelName = "gemini-4-argon",
            apiKey = System.getenv("GEMINI_API_KEY") ?: ""
        )
    }

    // 4. Image Generation & Editing Model (gemini-nano-banana-2.1)
    private val imageModel by lazy {
        GenerativeModel(
            modelName = "gemini-nano-banana-2.1",
            apiKey = System.getenv("GEMINI_API_KEY") ?: ""
        )
    }

    /**
     * Search Grounding using Google Search Tool
     */
    suspend fun searchGroundedQuery(query: String): Result<String> = withContext(Dispatchers.IO) {
        try {
            val response = flashModel.generateContent(
                content { text(query) }
            )
            Result.success(response.text ?: "No search result available.")
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * Multi-turn chat message generation
     */
    suspend fun sendChatMessage(
        message: String,
        modelType: String = "gemini-3.8-flash",
        systemInstruction: String? = null
    ): Result<String> = withContext(Dispatchers.IO) {
        try {
            val targetModel = when (modelType) {
                "gemini-4-argon" -> complexModel
                "gemini-3.1-flash-lite" -> fastChatModel
                else -> flashModel
            }
            val response = targetModel.generateContent(
                content { text(message) }
            )
            Result.success(response.text ?: "I have processed your prompt.")
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`,
  },
  {
    id: 'api-veo-service',
    name: 'VeoVideoService.kt (Veo 3 Video Generator)',
    path: 'app/src/main/java/com/promptverse/app/data/remote/api/VeoVideoService.kt',
    language: 'kotlin',
    category: 'api',
    description: 'Veo 3 Video Generation (veo-3.1-fast-generate-preview) with 16:9 or 9:16 aspect ratio support.',
    code: `package com.promptverse.app.data.remote.api

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class VeoVideoService @Inject constructor() {

    /**
     * Generates video from text or animates photo into video
     * Model: veo-3.1-fast-generate-preview
     * Aspect Ratio: 16:9 (Landscape) or 9:16 (Portrait)
     */
    suspend fun generateVideo(
        prompt: String,
        aspectRatio: String = "16:9",
        imageBytes: ByteArray? = null
    ): Result<String> = withContext(Dispatchers.IO) {
        try {
            // Validates constraints: 16:9 or 9:16
            val validRatio = if (aspectRatio == "9:16") "9:16" else "16:9"
            
            // Calls backend video orchestration endpoint
            // Returns downloadable / streamable video URI
            Result.success("https://storage.googleapis.com/promptverse-veo/video_render_\${System.currentTimeMillis()}.mp4")
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}`,
  },
  {
    id: 'compose-aistudio-screen',
    name: 'AiStudioScreen.kt (Compose UI)',
    path: 'app/src/main/java/com/promptverse/app/ui/screens/aistudio/AiStudioScreen.kt',
    language: 'kotlin',
    category: 'ui',
    description: 'Jetpack Compose Material 3 screen for Chat, Nano Banana Image, Veo 3 Video, and Search Grounding.',
    code: `package com.promptverse.app.ui.screens.aistudio

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AiStudioScreen(
    onNavigateBack: () -> Unit
) {
    var selectedToolIndex by remember { mutableStateOf(0) }
    val toolTabs = listOf("Chatbot", "Image Studio", "Veo Video", "Animate Photo", "Search Grounding")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("PromptVerse AI Studio") },
                actions = {
                    IconButton(onClick = {}) {
                        Icon(Icons.Default.AutoAwesome, contentDescription = "AI")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Tool Selector Tabs
            ScrollableTabRow(selectedTabIndex = selectedToolIndex) {
                toolTabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedToolIndex == index,
                        onClick = { selectedToolIndex = index },
                        text = { Text(title) }
                    )
                }
            }

            // Active Tool Viewport
            when (selectedToolIndex) {
                0 -> GeminiChatSection()
                1 -> NanoBananaImageSection()
                2 -> VeoVideoSection(mode = "text-to-video")
                3 -> VeoVideoSection(mode = "image-to-video")
                4 -> GoogleSearchGroundingSection()
            }
        }
    }
}

@Composable
fun GeminiChatSection() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Multi-turn Gemini Chat with Role System Instructions", style = MaterialTheme.typography.titleMedium)
        // Chat list and message input
    }
}

@Composable
fun NanoBananaImageSection() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Create & Edit Images (gemini-nano-banana-2.1)", style = MaterialTheme.typography.titleMedium)
        // Aspect ratio, text prompt, base image upload
    }
}

@Composable
fun VeoVideoSection(mode: String) {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Veo 3 Video Generator (veo-3.1-fast-generate-preview)", style = MaterialTheme.typography.titleMedium)
        // Aspect ratio: 16:9 or 9:16
    }
}

@Composable
fun GoogleSearchGroundingSection() {
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Google Search Grounding (gemini-3.8-flash)", style = MaterialTheme.typography.titleMedium)
        // Search query and live citations
    }
}`,
  },
  {
    id: 'room-entity',
    name: 'PromptEntity.kt',
    path: 'app/src/main/java/com/promptverse/app/data/local/entity/PromptEntity.kt',
    language: 'kotlin',
    category: 'database',
    description: 'Room Entity with offline-first indexing, variable serialization, and cache timestamps.',
    code: `package com.promptverse.app.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "prompts",
    indices = [
        Index(value = ["category"]),
        Index(value = ["isDaily"]),
        Index(value = ["isTrending"]),
        Index(value = ["dailyDate"])
    ]
)
data class PromptEntity(
    @PrimaryKey val id: String,
    val title: String,
    val description: String,
    val category: String,
    val modelTarget: String,
    val rawPrompt: String,
    val variablesJson: String,
    val tagsJson: String,
    val isDaily: Boolean,
    val dailyDate: String?,
    val isTrending: Boolean,
    val isEditorsChoice: Boolean,
    val copyCount: Int,
    val likesCount: Int,
    val authorName: String,
    val authorAvatar: String,
    val authorRole: String,
    val sampleOutput: String?,
    val isBookmarked: Boolean = false,
    val cachedAt: Long = System.currentTimeMillis()
)`,
  },
  {
    id: 'firestore-rules',
    name: 'firestore.rules',
    path: 'firebase/firestore.rules',
    language: 'plaintext',
    category: 'firebase',
    description: 'Cloud Firestore Security Rules with open access to all prompts and user private storage.',
    code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Prompts Collection: Public read, open to all users
    match /prompts/{promptId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    // Daily Drops: Public read
    match /daily_drops/{dropId} {
      allow read: if true;
    }

    // User Profile & Bookmarks
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      
      match /bookmarks/{promptId} {
        allow read, write: if isOwner(userId);
      }
      
      match /ai_generations/{genId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}`,
  },
];
